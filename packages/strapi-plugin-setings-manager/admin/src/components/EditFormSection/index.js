/**
*
* EditFormSection
*
*/

import React from 'react';
import { map, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
// design
import InputNumber from 'components/InputNumber';
import InputText from 'components/InputText';
import InputToggle from 'components/InputToggle';
import InputSelect from 'components/InputSelect';
import InputEnum from 'components/InputEnum';
import config from './config.json';
import styles from './styles.scss';

class EditFormSection extends React.Component { // eslint-disable-line react/prefer-stateless-function

  renderInput = (props, key) => {
    const inputs = {
      string: InputText,
      number: InputNumber,
      boolean: InputToggle,
      enum: InputEnum,
      select: InputSelect,
    };
    const Input = inputs[props.type];
    const customBootstrapClass = config[props.target] || "";
    const inputValue = this.props.values[props.target];
    // retrieve options for the select input
    const selectOptions = props.type === 'enum' ? props.items : [];
    return (
      // <div />
      <Input
        customBootstrapClass={customBootstrapClass}
        key={key}
        handleChange={this.props.handleChange}
        name={props.name}
        target={props.target}
        isChecked={inputValue}
        selectOptions={selectOptions}
        validations={props.validations}
        value={inputValue}
      />
    );
  }

  render() {
    const sectionName = isEmpty(this.props.section.name) ? '' : <FormattedMessage {...{id: this.props.section.name}} />;

    return (
      <div className={styles.editFormSection}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <span className={styles.sectionHeader}>
                {sectionName}
              </span>
            </div>
            <form>
              {map(this.props.section.items, (item, key) => (
                this.renderInput(item, key)
              ))}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

EditFormSection.propTypes = {
  handleChange: React.PropTypes.func.isRequired,
  section: React.PropTypes.object,
  values: React.PropTypes.object,
};

export default EditFormSection;
