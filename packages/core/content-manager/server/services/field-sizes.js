'use strict';

const needsFullSize = {
  default: 12,
  isResizable: false,
};

const smallSize = {
  default: 4,
  isResizable: true,
};

const defaultSize = {
  default: 6,
  isResizable: true,
};

const fieldSizes = {
  // Full row and not resizable
  dynamiczone: needsFullSize,
  component: needsFullSize,
  json: needsFullSize,
  richtext: needsFullSize,
  // Small and resizable
  checkbox: smallSize,
  boolean: smallSize,
  date: smallSize,
  time: smallSize,
  biginteger: smallSize,
  decimal: smallSize,
  float: smallSize,
  integer: smallSize,
  number: smallSize,
  // Medium and resizable
  datetime: defaultSize,
  email: defaultSize,
  enumeration: defaultSize,
  media: defaultSize,
  password: defaultSize,
  relation: defaultSize,
  string: defaultSize,
  text: defaultSize,
  timestamp: defaultSize,
  uid: defaultSize,
};

module.exports = ({ strapi }) => ({
  getAllFieldSizes() {
    return fieldSizes;
  },
  getFieldSize(type) {
    if (!type) {
      throw new Error('The type is required');
    }

    const fieldSize = fieldSizes[type];
    if (!fieldSize) {
      throw new Error(`Could not find field size for type ${type}`);
    }

    return fieldSize;
  },
  setFieldSize(type, size) {
    if (!type) {
      throw new Error('The type is required');
    }

    if (!size) {
      throw new Error('The size is required');
    }

    fieldSizes[type] = size;
  },
  registerCustomFields() {
    // Find all custom fields already registered
    const customFields = strapi.container.get('custom-fields').getAll();

    // If they have a custom field size, register it
    Object.entries(customFields).forEach(([uid, customField]) => {
      if (customField.inputSize) {
        this.setFieldSize(uid, customField.inputSize);
      }
    });
  },
});
