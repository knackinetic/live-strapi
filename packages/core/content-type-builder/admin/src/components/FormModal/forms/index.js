import get from 'lodash/get';
import toLower from 'lodash/toLower';
import { nameToSlug } from '../utils/createUid';
import getTrad from '../../../utils/getTrad';
import { attributesForm, attributeTypes, commonBaseForm } from '../attributes';
import { categoryForm, createCategorySchema } from '../category';
import { contentTypeForm, createContentTypeSchema } from '../contentType';
import { createComponentSchema, componentForm } from '../component';
import { dynamiczoneForm } from '../dynamicZone';

const forms = {
  attribute: {
    schema(
      currentSchema,
      attributeType,
      reservedNames,
      alreadyTakenTargetContentTypeAttributes,
      options,
      extensions
    ) {
      const attributes = get(currentSchema, ['schema', 'attributes'], []);

      const usedAttributeNames = attributes
        .filter(({ name }) => {
          return name !== options.initialData.name;
        })
        .map(({ name }) => name);

      try {
        let attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          reservedNames.attributes,
          alreadyTakenTargetContentTypeAttributes,
          options
        );

        return extensions.makeValidator(
          ['attribute', attributeType],
          attributeShape,
          usedAttributeNames,
          reservedNames.attributes,
          alreadyTakenTargetContentTypeAttributes,
          options
        );
      } catch (err) {
        console.error('Error yup build schema', err);

        return attributeTypes.default(usedAttributeNames, reservedNames.attributes);
      }
    },
    form: {
      advanced({ data, type, step, extensions, ...rest }) {
        try {
          const baseForm = attributesForm.advanced[type](data, step).sections;
          const itemsToAdd = extensions.getAdvancedForm(['attribute', type], {
            data,
            type,
            step,
            ...rest,
          });

          const sections = baseForm.reduce((acc, current) => {
            if (current.sectionTitle === null) {
              acc.push(current);
            } else {
              acc.push({ ...current, items: [...current.items, ...itemsToAdd] });
            }

            return acc;
          }, []);
          // IF we want a dedicated section for the plugins
          // const sections = [
          //   ...baseForm,
          //   {
          //     sectionTitle: { id: 'Zone pour plugins', defaultMessage: 'Zone pour plugins' },
          //     items: itemsToAdd,
          //   },
          // ];

          return { sections };
        } catch (err) {
          console.error(err);

          return { sections: [] };
        }
      },
      base({ data, type, step, attributes }) {
        try {
          return attributesForm.base[type](data, step, attributes);
        } catch (err) {
          return commonBaseForm;
        }
      },
    },
  },
  contentType: {
    schema(alreadyTakenNames, isEditing, ctUid, reservedNames, extensions) {
      const takenNames = isEditing
        ? alreadyTakenNames.filter(uid => uid !== ctUid)
        : alreadyTakenNames;

      const contentTypeShape = createContentTypeSchema(takenNames, reservedNames.models);

      return extensions.makeValidator(
        ['contentType'],
        contentTypeShape,
        takenNames,
        reservedNames.models
      );
    },
    form: {
      base({ data = {}, actionType }) {
        if (actionType === 'create') {
          const value = data.name ? nameToSlug(data.name) : '';

          return contentTypeForm.base.create(value);
        }

        return contentTypeForm.base.edit();
      },
      advanced({ extensions, ...rest }) {
        const baseForm = contentTypeForm.advanced.default(rest).sections;
        const itemsToAdd = extensions.getAdvancedForm(['contentType']);

        return {
          sections: [
            ...baseForm,
            {
              sectionTitle: {
                id: getTrad('form.attribute.item.settings.name'),
                defaultMessage: 'Settings',
              },
              items: itemsToAdd,
            },
          ],
        };
      },
    },
  },
  component: {
    schema(
      alreadyTakenAttributes,
      componentCategory,
      reservedNames,
      isEditing = false,
      compoUid = null
    ) {
      const takenNames = isEditing
        ? alreadyTakenAttributes.filter(uid => uid !== compoUid)
        : alreadyTakenAttributes;

      return createComponentSchema(takenNames, reservedNames.models, componentCategory);
    },
    form: {
      advanced() {
        return {
          sections: componentForm.advanced(),
        };
      },
      base() {
        return {
          sections: componentForm.base(),
        };
      },
    },
  },
  addComponentToDynamicZone: {
    form: {
      advanced() {
        return dynamiczoneForm.advanced.default();
      },
      base({ data }) {
        const isCreatingComponent = get(data, 'createComponent', false);

        if (isCreatingComponent) {
          return dynamiczoneForm.base.createComponent();
        }

        return dynamiczoneForm.base.default();
      },
    },
  },
  editCategory: {
    schema(allCategories, initialData) {
      const allowedCategories = allCategories
        .filter(cat => cat !== initialData.name)
        .map(cat => toLower(cat));

      return createCategorySchema(allowedCategories);
    },
    form: {
      advanced: () => ({ sections: [] }),
      base() {
        return categoryForm.base;
      },
    },
  },
};

export default forms;
