import { get } from 'lodash';
import { getType, getOtherInfos } from './getAttributeInfos';

const defaultFields = [
  'created_at',
  'createdAt',
  'created_by',
  'createdBy',
  'updated_at',
  'updatedAt',
  'updated_by',
  'updatedBy',
  'id',
  '_id',
];

const removeFieldsFromClonedData = (
  data,
  contentTypeSchema,
  componentSchema,
  fields = defaultFields
) => {
  const recursiveCleanData = (data, schema) => {
    return Object.keys(data).reduce((acc, current) => {
      const attrType = getType(schema.schema, current);
      const value = get(data, current);
      const component = getOtherInfos(schema.schema, [current, 'component']);
      const isRepeatable = getOtherInfos(schema.schema, [current, 'repeatable']);

      if (fields.indexOf(current) !== -1) {
        delete acc[current];

        return acc;
      }

      if (attrType === 'dynamiczone') {
        acc[current] = value.map(componentValue => {
          const subCleanedData = recursiveCleanData(
            componentValue,
            componentSchema[componentValue.__component]
          );

          return subCleanedData;
        });

        return acc;
      }

      if (attrType === 'component') {
        if (isRepeatable) {
          /* eslint-disable indent */
          acc[current] = value
            ? value.map(compoData => {
                const subCleanedData = recursiveCleanData(compoData, componentSchema[component]);

                return subCleanedData;
              })
            : value;
          /* eslint-enable indent */
        } else {
          acc[current] = value ? recursiveCleanData(value, componentSchema[component]) : value;
        }

        return acc;
      }

      acc[current] = value;

      return acc;
    }, {});
  };

  return recursiveCleanData(data, contentTypeSchema);
};

export default removeFieldsFromClonedData;
