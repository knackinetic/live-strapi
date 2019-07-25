import React from 'react';
import mountWithIntl from 'testUtils/mountWithIntl';
import formatMessagesWithPluginId from 'testUtils/formatMessages';

import pluginId from '../../../pluginId';
import pluginTradsEn from '../../../translations/en.json';
import RelationFormGroup from '../index';

const messages = formatMessagesWithPluginId(pluginId, pluginTradsEn);
const renderComponent = (props = {}, context = {}) =>
  mountWithIntl(<RelationFormGroup {...props} />, messages, context);

describe('<RelationFormGroup />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      activeTab: 'base',
      alreadyTakenAttributes: [],
      attributeToEditName: '',
      setTempAttribute: jest.fn(),
      isOpen: true,
      features: [],
      featureToEditName: '',
      modifiedData: {
        key: '',
        name: '',
        source: '',
      },
      onCancel: jest.fn(),
      onChange: jest.fn(),
      onChangeRelationNature: jest.fn(),
      onChangeRelationTarget: jest.fn(),
      onSubmit: jest.fn(),
      onSubmitEdit: jest.fn(),
      setTempAttribute: jest.fn(),
      push: jest.fn(),
      source: null,
    };
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should not crash', () => {
    wrapper = renderComponent(props);
  });

  it('should render the advanced tab if the active tab is advanced', () => {
    props.activeTab = 'advanced';

    wrapper = renderComponent(props);
    const compo = wrapper.find(RelationFormGroup);
    const spyOnRenderAdvancedSettings = jest.spyOn(
      compo.instance(),
      'renderAdvancedSettings'
    );
    compo.instance().forceUpdate();

    expect(spyOnRenderAdvancedSettings).toHaveBeenCalled();
  });

  describe('GetFormErrors', () => {
    it('should return an object with the errors if the form is empty', () => {
      wrapper = renderComponent(props);
      const { getFormErrors } = wrapper.find(RelationFormGroup).instance();

      expect(getFormErrors()).toEqual({
        name: [{ id: 'content-type-builder.error.validation.required' }],
        key: [{ id: 'content-type-builder.error.validation.required' }],
      });
    });

    it('should return an object if a name is already taken', () => {
      props.alreadyTakenAttributes = ['test'];
      props.modifiedData.name = 'test';
      props.modifiedData.key = 'strapi';

      wrapper = renderComponent(props);
      const { getFormErrors } = wrapper.find(RelationFormGroup).instance();

      expect(getFormErrors()).toEqual({
        name: [{ id: 'content-type-builder.error.attribute.key.taken' }],
      });
    });

    it('should return an error if the key is equal to the name', () => {
      props.alreadyTakenAttributes = [];
      props.modifiedData.name = 'test';
      props.modifiedData.key = 'test';

      wrapper = renderComponent(props);
      const { getFormErrors } = wrapper.find(RelationFormGroup).instance();

      expect(getFormErrors()).toEqual({
        key: [{ id: 'content-type-builder.error.attribute.key.taken' }],
      });
    });

    it('should not return an error when editing', () => {
      props.alreadyTakenAttributes = ['test', 'strapi'];
      props.modifiedData.name = 'test';
      props.modifiedData.key = 'strapi';
      props.actionType = 'edit';
      props.attributeToEditName = 'test';

      wrapper = renderComponent(props);
      const { getFormErrors } = wrapper.find(RelationFormGroup).instance();

      expect(getFormErrors()).toEqual({});
    });
  });

  describe('<RelationFormGroup />, basic instances', () => {
    describe('HandleChangeRelationTarget', () => {
      it('should call the onChangeRelationTarget with the correct data (not editing)', () => {
        props.featureToEditName = 'test';

        wrapper = renderComponent(props);
        const { handleChangeRelationTarget } = wrapper
          .find(RelationFormGroup)
          .instance();

        handleChangeRelationTarget('strapi');

        expect(props.onChangeRelationTarget).toHaveBeenLastCalledWith(
          'strapi',
          'test',
          false
        );
      });

      it('should call the onChangeRelationTarget with the correct data (editing)', () => {
        props.featureToEditName = 'test';
        props.actionType = 'edit';

        wrapper = renderComponent(props);
        const { handleChangeRelationTarget } = wrapper
          .find(RelationFormGroup)
          .instance();

        handleChangeRelationTarget('strapi');

        expect(props.onChangeRelationTarget).toHaveBeenLastCalledWith(
          'strapi',
          'test',
          true
        );
      });
    });

    describe('HandleCancel', () => {
      it('should clear the search', () => {
        wrapper = renderComponent(props);
        const { handleCancel } = wrapper.find(RelationFormGroup).instance();

        handleCancel();

        expect(props.push).toHaveBeenCalledWith({ search: '' });
      });
    });

    describe('HandleGoTo', () => {
      it('should emit the event didSelectContentTypeFieldSettings if the user clicks on the advanced tab', () => {
        const context = { emitEvent: jest.fn() };

        wrapper = renderComponent(props, context);
        const { handleGoTo } = wrapper.find(RelationFormGroup).instance();

        handleGoTo('advanced');

        expect(props.push).toHaveBeenCalledWith({
          search:
            'modalType=attributeForm&attributeType=relation&settingType=advanced&actionType=create',
        });
        expect(context.emitEvent).toHaveBeenCalledWith(
          'didSelectContentTypeFieldSettings'
        );
      });

      it('should add the keep the attribute name if the action is edit', () => {
        const context = { emitEvent: jest.fn() };
        props.actionType = 'edit';
        props.attributeToEditName = 'test';
        wrapper = renderComponent(props, context);
        const { handleGoTo } = wrapper.find(RelationFormGroup).instance();

        handleGoTo('advanced');

        expect(props.push).toHaveBeenCalledWith({
          search:
            'modalType=attributeForm&attributeType=relation&settingType=advanced&actionType=edit&attributeName=test',
        });
        expect(context.emitEvent).toHaveBeenCalledWith(
          'didSelectContentTypeFieldSettings'
        );
      });

      it('should not emit the event if the tab is base', () => {
        const context = { emitEvent: jest.fn() };

        wrapper = renderComponent(props, context);
        const { handleGoTo } = wrapper.find(RelationFormGroup).instance();

        handleGoTo('base');

        expect(props.push).toHaveBeenCalledWith({
          search:
            'modalType=attributeForm&attributeType=relation&settingType=base&actionType=create',
        });
        expect(context.emitEvent).not.toHaveBeenCalled();
      });
    });

    describe('HandleOnClosed', () => {
      it('should update the state and call the onCancel prop', () => {
        wrapper = renderComponent(props);
        const compo = wrapper.find(RelationFormGroup);
        compo.setState({ showForm: true, formErrors: { name: [] } });

        expect(compo.state('showForm')).toBeTruthy();

        const { handleOnClosed } = compo.instance();

        handleOnClosed();

        expect(compo.state('formErrors')).toEqual({});
        expect(compo.state('showForm')).toBeFalsy();
        expect(props.onCancel).toHaveBeenCalled();
      });
    });

    describe('HandleOnOpened', () => {
      it('should update the state and call the onCancel prop', () => {
        props.features = [{ name: 'test', source: 'test' }];
        wrapper = renderComponent(props);
        const compo = wrapper.find(RelationFormGroup);

        expect(compo.state('showForm')).toBeFalsy();

        const { handleOnOpened } = compo.instance();

        handleOnOpened();

        expect(compo.state('showForm')).toBeTruthy();
        expect(props.setTempAttribute).toHaveBeenCalledWith(
          'test',
          false,
          'test',
          '',
          false
        );
      });
      it('should update the state and call the onCancel prop', () => {
        props.features = [{ name: 'test' }];
        props.featureToEditName = 'strapi';
        props.actionType = 'edit';
        props.attributeToEditName = 'test';
        wrapper = renderComponent(props);
        const compo = wrapper.find(RelationFormGroup);

        expect(compo.state('showForm')).toBeFalsy();

        const { handleOnOpened } = compo.instance();

        handleOnOpened();

        expect(compo.state('showForm')).toBeTruthy();
        expect(props.setTempAttribute).toHaveBeenCalledWith(
          'strapi',
          false,
          undefined,
          'test',
          true
        );
      });
    });

    describe('HandleSubmit', () => {
      it('should call the submit prop if there is no error', () => {
        props.modifiedData = {
          name: 'test',
          nature: 'oneWay',
          target: 'test',
          key: '-',
        };
        wrapper = renderComponent(props);
        const { handleSubmit } = wrapper.instance();

        handleSubmit({ preventDefault: jest.fn() });

        expect(props.onSubmit).toHaveBeenCalledWith(false);
      });

      it('should not call the submit if the form is empty', () => {
        wrapper = renderComponent(props);
        const { handleSubmit } = wrapper.instance();

        handleSubmit({ preventDefault: jest.fn() });

        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    describe('HandleSubmitAndContinue', () => {
      it('should call the submit prop if there is no error', () => {
        props.modifiedData = {
          name: 'test',
          nature: 'oneWay',
          target: 'test',
          key: '-',
        };
        wrapper = renderComponent(props);
        const { handleSubmitAndContinue } = wrapper.instance();

        handleSubmitAndContinue({ preventDefault: jest.fn() });

        expect(props.onSubmit).toHaveBeenCalledWith(true);
      });

      it('should not call the submit if the form is empty', () => {
        wrapper = renderComponent(props);
        const { handleSubmitAndContinue } = wrapper.instance();

        handleSubmitAndContinue({ preventDefault: jest.fn() });

        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    describe('HandleToggle', () => {
      it('should clear the search', () => {
        wrapper = renderComponent(props);
        const { handleToggle } = wrapper.instance();

        handleToggle();

        expect(props.push).toHaveBeenCalledWith({ search: '' });
      });
    });
    describe('Submit', () => {
      it('should call the onSubmitEditProp if the actionType is edit', () => {
        props.actionType = 'edit';
        wrapper = renderComponent(props);

        const { submit } = wrapper.instance();

        submit();

        expect(props.onSubmitEdit).toHaveBeenCalledWith(false);
      });

      it('should call the onSubmitEdit if the actionType is create', () => {
        wrapper = renderComponent(props);

        const { submit } = wrapper.instance();

        submit(true);

        expect(props.onSubmit).toHaveBeenCalledWith(true);
      });
    });
  });
});
