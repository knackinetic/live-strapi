'use strict';

const { mapAsync } = require('@strapi/utils');

const { STAGE_MODEL_UID } = require('../../constants/workflows');
const { getService } = require('../../utils');

module.exports = ({ strapi }) => {
  const workflowsService = getService('workflows', { strapi });

  return {
    find({ workflowId, populate }) {
      const params = {
        filters: { workflow: workflowId },
        populate,
      };
      return strapi.entityService.findMany(STAGE_MODEL_UID, params);
    },

    findById(id, { workflowId, populate }) {
      const params = {
        filters: { workflow: workflowId },
        populate,
      };
      return strapi.entityService.findOne(STAGE_MODEL_UID, id, params);
    },

    createMany(stagesList, { fields }) {
      const params = {
        select: fields,
      };
      return Promise.all(
        stagesList.map((stage) =>
          strapi.entityService.create(STAGE_MODEL_UID, { data: stage, ...params })
        )
      );
    },

    update(stageId, stageData) {
      return strapi.entityService.update(STAGE_MODEL_UID, stageId, { data: stageData });
    },

    delete(stageId) {
      return strapi.entityService.delete(STAGE_MODEL_UID, stageId);
    },

    count() {
      return strapi.entityService.count(STAGE_MODEL_UID);
    },

    async replaceWorkflowStages(workflowId, stages) {
      const workflow = await workflowsService.findById(workflowId, { populate: ['stages'] });

      const { created, updated, deleted } = getDiffBetweenStages(workflow.stages, stages);

      const newStages = await this.createMany(created, { fields: ['id'] });
      const assignedStagesToWorkflow = stages.map((stage) => stage.id ?? newStages.shift().id);

      await mapAsync(updated, (stage) => this.update(stage.id, stage));
      await mapAsync(deleted, (stage) => this.delete(stage.id));
      return workflowsService.update(workflowId, {
        stages: assignedStagesToWorkflow,
      });
    },
  };
};

function getDiffBetweenStages(sourceStages, comparisonStages) {
  const result = comparisonStages.reduce(
    (acc, stageToCompare) => {
      const srcStage = sourceStages.find((stage) => stage.id === stageToCompare.id);

      if (!srcStage) {
        acc.created.push(stageToCompare);
      } else if (srcStage.name !== stageToCompare.name) {
        acc.updated.push(stageToCompare);
      }
      return acc;
    },
    { created: [], updated: [] }
  );

  result.deleted = sourceStages.filter(
    (srcStage) => !comparisonStages.some((cmpStage) => cmpStage.id === srcStage.id)
  );

  return result;
}
