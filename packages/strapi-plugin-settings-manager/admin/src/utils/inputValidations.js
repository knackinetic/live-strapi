import { findIndex, mapKeys, forEach, includes, has, isUndefined, reject, isEmpty, size } from 'lodash';

export function checkFormValidity(formData, formValidations) {
  const errors = [];
  forEach(formData, (value, key) => { // eslint-disable-line consistent-return
    let valueValidations = formValidations[findIndex(formValidations, ['target', key])];
    let inputErrors = [];

    if (!valueValidations) {
      forEach(formValidations, (data) => {

        if (data.nestedValidations) {
          forEach(data.nestedValidations, (nestedData) => {
            if (nestedData.target === key) valueValidations = nestedData;
          })
        }
      });
    }

    // If section is disabled don't need further checks
    if (includes(key, 'enabled') && !value) return false;

    forEach(valueValidations.nestedValidations, (nestedValidations) => {
      if (nestedValidations.validations.required && !has(formData, nestedValidations.target)) {
        errors.push({ target: nestedValidations.target, errors: [{ id: 'request.error.validation.required' }] });
      }
    });

    if (!isUndefined(valueValidations)) {
      inputErrors = validate(value, valueValidations.validations);
    }

    if (!isEmpty(inputErrors)) errors.push({ target: key, errors: inputErrors });

    if (formData['security.xframe.value'] && formData['security.xframe.value'] === 'ALLOW-FROM.ALLOW-FROM ') {
      errors.push({ target: 'security.xframe.value.nested', errors: [{ id: 'request.error.validation.required' }] });
    }
  });

  return errors;
}


function validate(value, validations) {
  let errors = [];
  // Handle i18n
  const requiredError = { id: 'request.error.validation.required' };
  mapKeys(validations, (validationValue, validationKey) => {
    switch (validationKey) {
      case 'maxLength':
        if (value.length > validationValue) {
          errors.push({ id: 'request.error.validation.maxLength' });
        }
        break;
      case 'minLength':
        if (value.length < validationValue) {
          errors.push({ id: 'request.error.validation.minLength' });
        }
        break;
      case 'required':
        if (value.length === 0) {
          errors.push({ id: 'request.error.validation.required' });
        }
        break;
      case 'regex':
        if (!new RegExp(validationValue).test(value)) {
          errors.push({ id: 'request.error.validation.regex' });
        }
        break;
      default:
        errors = [];
    }
  });

  if (includes(errors, requiredError)) {
    errors = reject(errors, (error) => error !== requiredError);
  }
  return errors;
}


/*
* @method : get input validations from configs
* @param {object} configs
*
* @return {array} returns formValidations
*/


export function getInputsValidationsFromConfigs(configs) {
  const formValidations = [];

  forEach(configs.sections, (section) => {
    forEach(section.items, (item) => {

      if (!isUndefined(item.target)) {
        const validations = {
          target: item.target,
          validations: item.validations,
        };

        if (has(item, 'items') && item.type !== 'select') {
          validations.nestedValidations = [];

          forEach(item.items, (subItem, key) => {
            if (!isUndefined(subItem.target) && !isUndefined(subItem.validations)) {
              if (has(subItem, 'items')) {
                validations.nestedValidations.push({ target: subItem.target, validations: subItem.validations, nestedValidations: [] });
                forEach(subItem.items, (nestedSubItem) => {
                  if (!isUndefined(nestedSubItem.target)) {
                    validations.nestedValidations[key].nestedValidations.push({ target: nestedSubItem.target, validations: nestedSubItem.validations });
                  }
                });
              } else {
                validations.nestedValidations.push({ target: subItem.target, validations: subItem.validations });
              }
            }
          });
          formValidations.push(validations)
        } else {
          formValidations.push(validations);
        }
      }
    });
  });

  return formValidations;
}

/* eslint-disable no-template-curly-in-string */

export function getRequiredInputsDb(data) {
  const formErrors = [
    { target: 'database.connections.${name}.name', errors: [{ id: 'request.error.validation.required' }] },
    { target: 'database.connections.${name}.settings.host', errors: [{ id: 'request.error.validation.required' }] },
    { target: 'database.connections.${name}.settings.port', errors: [{ id: 'request.error.validation.required' }] },
    { target: 'database.connections.${name}.settings.database', errors: [{ id: 'request.error.validation.required' }] },
    { target: 'database.connections.${name}.settings.username', errors: [{ id: 'request.error.validation.required' }] },
  ];

  // If size data === 2 user hasn't filled any input,
  if (size(data) === 2) return formErrors;
  return formErrors;
}
