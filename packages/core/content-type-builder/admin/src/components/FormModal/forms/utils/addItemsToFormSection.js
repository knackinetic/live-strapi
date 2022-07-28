import has from 'lodash/has';
/**
 * @description
 * Adds form options to the default section or as a new section
 * @param {array} formTypeOptions Base or advanced options
 * @param {array} sections The sections to mutate
 */
const addItemsToFormSection = (formTypeOptions, sections) => {
  formTypeOptions.forEach(item => {
    if (!has(item, 'sectionTitle')) {
      // When there is no sectionTitle key,
      // add the item to the default section
      return sections[0].items.push(item);
    }

    // Otherwise, when no sectionTitle is present or sectionTitle has a value (including null),
    // add the item as a new section
    return sections.push(item);
  });
};

export default addItemsToFormSection;
