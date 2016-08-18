import LocaleToggle from '../index';
import LanguageProvider from '../../LanguageProvider';

import expect from 'expect';
import { shallow, mount } from 'enzyme';
import configureStore from '../../../store';
import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { translationMessages } from '../../../i18n';

describe('<LocaleToggle />', () => {
  let store;

  before(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the default language messages', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <LocaleToggle />
        </LanguageProvider>
      </Provider>
    );
    expect(renderedComponent.contains(<LocaleToggle />)).toEqual(true);
  });

  it('should present the default `en` english language option', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <LocaleToggle />
        </LanguageProvider>
      </Provider>
    );
    expect(renderedComponent.contains(<option value="en">en</option>)).toEqual(true);
  });
});
