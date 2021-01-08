import getTrad from '../../../../utils/getTrad';

const fields = {
  // TODO check if used
  createComponent: {
    label: {
      id: getTrad('modalForm.attribute.text.type-selection'),
    },
    name: 'createComponent',
    type: 'booleanBox',
    size: 12,
    options: [
      {
        headerId: getTrad('form.attribute.component.option.create'),
        descriptionId: getTrad('form.attribute.component.option.create.description'),
        value: true,
      },
      {
        headerId: getTrad('form.attribute.component.option.reuse-existing'),
        descriptionId: getTrad('form.attribute.component.option.reuse-existing.description'),
        value: false,
      },
    ],
    validations: {},
  },
  default: {
    autoFocus: true,
    name: 'default',
    type: 'text',
    label: {
      id: getTrad('form.attribute.settings.default'),
    },
    validations: {},
  },
  defaultBoolean: {
    autoFocus: true,
    type: 'enum',
    label: {
      id: getTrad('form.attribute.settings.default'),
    },
    name: 'default',
    options: [
      { value: 'true', label: 'TRUE' },
      { value: '', label: 'NULL' },
      { value: 'false', label: 'FALSE' },
    ],
    validations: {},
  },

  divider: {
    type: 'divider',
  },
  max: {
    autoFocus: false,
    name: 'max',
    type: 'customCheckboxWithChildren',
    label: {
      id: getTrad('form.attribute.item.maximum'),
    },
    validations: {},
  },
  maxLength: {
    autoFocus: false,
    name: 'maxLength',
    type: 'customCheckboxWithChildren',
    label: {
      id: getTrad('form.attribute.item.maximumLength'),
    },
    validations: {},
  },
  min: {
    autoFocus: false,
    name: 'min',
    type: 'customCheckboxWithChildren',
    label: {
      id: getTrad('form.attribute.item.minimum'),
    },
    validations: {},
  },
  minLength: {
    autoFocus: false,
    name: 'minLength',
    type: 'customCheckboxWithChildren',
    label: {
      id: getTrad('form.attribute.item.minimumLength'),
    },
    validations: {},
  },
  name: {
    autoFocus: true,
    name: 'name',
    type: 'text',
    label: {
      id: getTrad('modalForm.attribute.form.base.name'),
    },
    description: {
      id: getTrad('modalForm.attribute.form.base.name.description'),
    },
    validations: {
      required: true,
    },
  },
  required: {
    autoFocus: false,
    name: 'required',
    type: 'checkbox',
    label: {
      id: getTrad('form.attribute.item.requiredField'),
    },
    description: {
      id: getTrad('form.attribute.item.requiredField.description'),
    },
    validations: {},
  },
  private: {
    autoFocus: false,
    name: 'private',
    type: 'checkbox',
    label: {
      id: getTrad('form.attribute.item.privateField'),
    },
    description: {
      id: getTrad('form.attribute.item.privateField.description'),
    },
    validations: {},
  },
  regex: {
    autoFocus: false,
    label: {
      id: getTrad('form.attribute.item.text.regex'),
    },
    name: 'regex',
    type: 'text',
    validations: {},
    description: {
      id: getTrad('form.attribute.item.text.regex.description'),
    },
  },
  unique: {
    autoFocus: false,
    name: 'unique',
    type: 'checkbox',
    label: {
      id: getTrad('form.attribute.item.uniqueField'),
    },
    description: {
      id: getTrad('form.attribute.item.uniqueField.description'),
    },
    validations: {},
  },
};

export default fields;
