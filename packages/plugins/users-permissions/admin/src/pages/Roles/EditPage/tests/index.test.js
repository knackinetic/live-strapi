import React from 'react';
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { Router, Switch, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { createMemoryHistory } from 'history';
import pluginId from '../../../../pluginId';
import RolesEditPage from '..';
import server from './server';

jest.mock('@strapi/helper-plugin', () => {
  // Make sure the references of the mock functions stay the same, otherwise we get an endless loop
  const mockToggleNotification = jest.fn();
  const mockUseNotification = jest.fn(() => {
    return mockToggleNotification;
  });

  return {
    ...jest.requireActual('@strapi/helper-plugin'),
    useNotification: mockUseNotification,
    useOverlayBlocker: jest.fn(() => ({ lockApp: jest.fn(), unlockApp: jest.fn() })),
  };
});

function makeAndRenderApp() {
  const history = createMemoryHistory();
  const app = (
    <IntlProvider locale="en" messages={{}} textComponent="span">
      <ThemeProvider theme={lightTheme}>
        <Router history={history}>
          <Switch>
            <Route path={`/settings/${pluginId}/roles/:id`} component={RolesEditPage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </IntlProvider>
  );
  const renderResult = render(app);
  history.push(`/settings/${pluginId}/roles/1`);

  return renderResult;
}

describe('Admin | containers | RoleEditPage', () => {
  beforeAll(() => server.listen());

  beforeEach(() => jest.clearAllMocks());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('renders users-permissions edit role and matches snapshot', async () => {
    const { container, getByTestId, getByRole } = makeAndRenderApp();
    await waitForElementToBeRemoved(() => getByTestId('loader'));
    await waitFor(() => expect(getByRole('heading', { name: /permissions/i })).toBeInTheDocument());

    expect(container.firstChild).toMatchInlineSnapshot(`
      .c1 {
        background: #f6f6f9;
        padding-top: 24px;
        padding-right: 56px;
        padding-bottom: 40px;
        padding-left: 56px;
      }

      .c2 {
        padding-bottom: 8px;
      }

      .c12 {
        background: #4945ff;
        padding: 8px;
        padding-right: 16px;
        padding-left: 16px;
        border-radius: 4px;
        border-color: #4945ff;
        border: 1px solid #4945ff;
        cursor: pointer;
      }

      .c18 {
        padding-right: 56px;
        padding-left: 56px;
      }

      .c20 {
        background: #ffffff;
        padding-top: 24px;
        padding-right: 32px;
        padding-bottom: 24px;
        padding-left: 32px;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
      }

      .c33 {
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
      }

      .c36 {
        padding-top: 24px;
        padding-right: 32px;
        padding-bottom: 24px;
        padding-left: 32px;
      }

      .c41 {
        border-radius: 4px;
      }

      .c43 {
        background: #f6f6f9;
        padding-top: 24px;
        padding-right: 24px;
        padding-bottom: 24px;
        padding-left: 24px;
      }

      .c45 {
        max-width: 100%;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .c47 {
        min-width: 0;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .c52 {
        background: #dcdce4;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        cursor: pointer;
      }

      .c54 {
        color: #666687;
        width: 0.6875rem;
      }

      .c57 {
        background: #eaeaef;
        padding-top: 24px;
        padding-right: 32px;
        padding-bottom: 24px;
        padding-left: 32px;
      }

      .c8 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
      }

      .c9 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
      }

      .c13 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        gap: 8px;
      }

      .c19 {
        -webkit-align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        gap: 32px;
      }

      .c21 {
        -webkit-align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        gap: 16px;
      }

      .c25 {
        -webkit-align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c37 {
        -webkit-align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        gap: 24px;
      }

      .c38 {
        -webkit-align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        gap: 8px;
      }

      .c40 {
        -webkit-align-items: stretch;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        gap: 4px;
      }

      .c53 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .c11 {
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.25;
        color: #32324d;
      }

      .c16 {
        font-size: 0.75rem;
        line-height: 1.33;
        font-weight: 600;
        color: #ffffff;
      }

      .c17 {
        font-size: 1rem;
        line-height: 1.5;
        color: #666687;
      }

      .c22 {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25;
        color: #32324d;
      }

      .c27 {
        font-size: 0.75rem;
        line-height: 1.33;
        font-weight: 600;
        color: #32324d;
      }

      .c39 {
        font-size: 0.875rem;
        line-height: 1.43;
        color: #666687;
      }

      .c50 {
        font-size: 0.75rem;
        line-height: 1.33;
        color: #4945ff;
      }

      .c51 {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #4a4a6a;
      }

      .c42 {
        border: 1px solid #f6f6f9;
      }

      .c42:hover:not([aria-disabled='true']) {
        border: 1px solid #4945ff;
      }

      .c42:hover:not([aria-disabled='true']) .c10 {
        color: #4945ff;
      }

      .c42:hover:not([aria-disabled='true']) > .c7 {
        background: #f0f0ff;
      }

      .c42:hover:not([aria-disabled='true']) [data-strapi-dropdown='true'] {
        background: #d9d8ff;
      }

      .c55 path {
        fill: #666687;
      }

      .c26 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c26 > * + * {
        margin-top: 4px;
      }

      .c46 > * {
        margin-left: 0;
        margin-right: 0;
      }

      .c46 > * + * {
        margin-left: 12px;
      }

      .c48 {
        background: transparent;
        border: none;
        position: relative;
        outline: none;
      }

      .c48[aria-disabled='true'] {
        pointer-events: none;
      }

      .c48[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c48 svg {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        font-size: 0.625rem;
      }

      .c48 svg path {
        fill: #4945ff;
      }

      .c48:after {
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -4px;
        bottom: -4px;
        left: -4px;
        right: -4px;
        border: 2px solid transparent;
      }

      .c48:focus-visible {
        outline: none;
      }

      .c48:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c49 {
        text-align: left;
      }

      .c49 > span {
        max-width: 100%;
      }

      .c49 svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      .c49 svg path {
        fill: #8e8ea9;
      }

      .c44 {
        min-height: 5.5rem;
        border-radius: 4px;
      }

      .c44:hover svg path {
        fill: #4945ff;
      }

      .c14 {
        position: relative;
        outline: none;
      }

      .c14 svg {
        height: 12px;
        width: 12px;
      }

      .c14 svg > g,
      .c14 svg path {
        fill: #ffffff;
      }

      .c14[aria-disabled='true'] {
        pointer-events: none;
      }

      .c14:after {
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -4px;
        bottom: -4px;
        left: -4px;
        right: -4px;
        border: 2px solid transparent;
      }

      .c14:focus-visible {
        outline: none;
      }

      .c14:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c15 {
        height: 2rem;
      }

      .c15[aria-disabled='true'] {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c15[aria-disabled='true'] .c10 {
        color: #666687;
      }

      .c15[aria-disabled='true'] svg > g,.c15[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c15[aria-disabled='true']:active {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c15[aria-disabled='true']:active .c10 {
        color: #666687;
      }

      .c15[aria-disabled='true']:active svg > g,.c15[aria-disabled='true']:active svg path {
        fill: #666687;
      }

      .c15:hover {
        border: 1px solid #7b79ff;
        background: #7b79ff;
      }

      .c15:active {
        border: 1px solid #4945ff;
        background: #4945ff;
      }

      .c15 svg > g,
      .c15 svg path {
        fill: #ffffff;
      }

      .c29 {
        border: none;
        border-radius: 4px;
        padding-bottom: 0.65625rem;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 0.65625rem;
        color: #32324d;
        font-weight: 400;
        font-size: 0.875rem;
        display: block;
        width: 100%;
        background: inherit;
      }

      .c29::-webkit-input-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c29::-moz-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c29:-ms-input-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c29::placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c29[aria-disabled='true'] {
        color: inherit;
      }

      .c29:focus {
        outline: none;
        box-shadow: none;
      }

      .c28 {
        border: 1px solid #dcdce4;
        border-radius: 4px;
        background: #ffffff;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
      }

      .c28:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c23 {
        display: grid;
        grid-template-columns: repeat(12,1fr);
        gap: 16px;
      }

      .c34 {
        display: grid;
        grid-template-columns: repeat(12,1fr);
      }

      .c24 {
        grid-column: span 6;
        max-width: 100%;
      }

      .c35 {
        grid-column: span 7;
        max-width: 100%;
      }

      .c56 {
        grid-column: span 5;
        max-width: 100%;
      }

      .c0:focus-visible {
        outline: none;
      }

      .c31 {
        border: 1px solid #dcdce4;
        border-radius: 4px;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 12px;
        padding-bottom: 12px;
        background: #ffffff;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
      }

      .c31:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c32 {
        display: block;
        width: 100%;
        font-weight: 400;
        font-size: 0.875rem;
        border: none;
        color: #32324d;
        resize: none;
        background: inherit;
      }

      .c32::-webkit-input-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c32::-moz-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c32:-ms-input-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c32::placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c32:focus-within {
        outline: none;
      }

      .c30 textarea {
        height: 5rem;
        line-height: 1.25rem;
      }

      .c30 textarea::-webkit-input-placeholder {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #8e8ea9;
        opacity: 1;
      }

      .c30 textarea::-moz-placeholder {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #8e8ea9;
        opacity: 1;
      }

      .c30 textarea:-ms-input-placeholder {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #8e8ea9;
        opacity: 1;
      }

      .c30 textarea::placeholder {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #8e8ea9;
        opacity: 1;
      }

      .c4 {
        padding-right: 8px;
      }

      .c6 {
        font-size: 0.875rem;
        line-height: 1.43;
        color: #4945ff;
      }

      .c3 {
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-text-decoration: none;
        text-decoration: none;
        position: relative;
        outline: none;
      }

      .c3 svg path {
        fill: #4945ff;
      }

      .c3 svg {
        font-size: 0.625rem;
      }

      .c3:after {
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -4px;
        bottom: -4px;
        left: -4px;
        right: -4px;
        border: 2px solid transparent;
      }

      .c3:focus-visible {
        outline: none;
      }

      .c3:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c5 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      @media (max-width:68.75rem) {
        .c24 {
          grid-column: span;
        }
      }

      @media (max-width:34.375rem) {
        .c24 {
          grid-column: span;
        }
      }

      @media (max-width:68.75rem) {
        .c35 {
          grid-column: span;
        }
      }

      @media (max-width:34.375rem) {
        .c35 {
          grid-column: span;
        }
      }

      @media (max-width:68.75rem) {
        .c56 {
          grid-column: span;
        }
      }

      @media (max-width:34.375rem) {
        .c56 {
          grid-column: span;
        }
      }

      <main
        aria-labelledby="main-content-title"
        class="c0"
        id="main-content"
        tabindex="-1"
      >
        <form
          action="#"
          novalidate=""
        >
          <div
            style="height: 0px;"
          >
            <div
              class="c1"
              data-strapi-header="true"
            >
              <div
                class="c2"
              >
                <a
                  aria-current="page"
                  class="c3 active"
                  href="/settings/users-permissions/roles"
                >
                  <span
                    aria-hidden="true"
                    class="c4 c5"
                  >
                    <svg
                      fill="none"
                      height="1rem"
                      viewBox="0 0 24 24"
                      width="1rem"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24 13.3a.2.2 0 0 1-.2.2H5.74l8.239 8.239a.2.2 0 0 1 0 .282L12.14 23.86a.2.2 0 0 1-.282 0L.14 12.14a.2.2 0 0 1 0-.282L11.86.14a.2.2 0 0 1 .282 0L13.98 1.98a.2.2 0 0 1 0 .282L5.74 10.5H23.8c.11 0 .2.09.2.2v2.6Z"
                        fill="#212134"
                      />
                    </svg>
                  </span>
                  <span
                    class="c6"
                  >
                    Back
                  </span>
                </a>
              </div>
              <div
                class="c7 c8"
              >
                <div
                  class="c7 c9"
                >
                  <h1
                    class="c10 c11"
                  >
                    Authenticated
                  </h1>
                </div>
                <button
                  aria-disabled="false"
                  class="c7 c12 c13 c14 c15"
                  type="submit"
                >
                  <div
                    aria-hidden="true"
                    class=""
                  >
                    <svg
                      fill="none"
                      height="1rem"
                      viewBox="0 0 24 24"
                      width="1rem"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.727 2.97a.2.2 0 0 1 .286 0l2.85 2.89a.2.2 0 0 1 0 .28L9.554 20.854a.2.2 0 0 1-.285 0l-9.13-9.243a.2.2 0 0 1 0-.281l2.85-2.892a.2.2 0 0 1 .284 0l6.14 6.209L20.726 2.97Z"
                        fill="#212134"
                      />
                    </svg>
                  </div>
                  <span
                    class="c10 c16"
                  >
                    Save
                  </span>
                </button>
              </div>
              <p
                class="c10 c17"
              >
                Default role given to authenticated user.
              </p>
            </div>
          </div>
          <div
            class="c18"
          >
            <div
              class="c7 c19"
            >
              <div
                class="c20"
              >
                <div
                  class="c7 c21"
                >
                  <h2
                    class="c10 c22"
                  >
                    Role details
                  </h2>
                  <div
                    class="c23"
                  >
                    <div
                      class="c24"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div>
                            <div
                              class="c7 c25 c26"
                            >
                              <label
                                class="c10 c27"
                                for="1"
                              >
                                <div
                                  class="c7 c9"
                                >
                                  Name
                                </div>
                              </label>
                              <div
                                class="c7 c8 c28"
                              >
                                <input
                                  aria-disabled="false"
                                  aria-invalid="false"
                                  aria-required="false"
                                  class="c29"
                                  id="1"
                                  name="name"
                                  value="Authenticated"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="c24"
                    >
                      <div
                        class=""
                      >
                        <div
                          class="c30"
                        >
                          <div>
                            <div
                              class="c7 c25 c26"
                            >
                              <div
                                class="c7 c9"
                              >
                                <label
                                  class="c10 c27"
                                  for="3"
                                >
                                  <div
                                    class="c7 c9"
                                  >
                                    Description
                                  </div>
                                </label>
                              </div>
                              <div
                                class="c31"
                              >
                                <textarea
                                  aria-invalid="false"
                                  aria-required="false"
                                  class="c32"
                                  id="3"
                                  name="description"
                                >
                                  Default role given to authenticated user.
                                </textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="c33 c34"
              >
                <div
                  class="c35"
                >
                  <div
                    class="c36"
                  >
                    <div
                      class="c7 c37"
                    >
                      <div
                        class="c7 c38"
                      >
                        <h2
                          class="c10 c22"
                        >
                          Permissions
                        </h2>
                        <p
                          class="c10 c39"
                        >
                          Only actions bound by a route are listed below.
                        </p>
                      </div>
                      <div
                        class="c7 c40"
                      >
                        <div
                          aria-disabled="false"
                          class="c41 c42"
                          data-strapi-expanded="false"
                        >
                          <div
                            class="c7 c43 c8 c44"
                          >
                            <div
                              class="c7 c45 c9 c46"
                            >
                              <button
                                aria-controls="accordion-content-4"
                                aria-disabled="false"
                                aria-expanded="false"
                                aria-labelledby="accordion-label-4"
                                class="c7 c47 c9 c48 c49"
                                data-strapi-accordion-toggle="true"
                                type="button"
                              >
                                <span
                                  class="c10 c50"
                                >
                                  <span
                                    class="c10 c51"
                                    id="accordion-label-4"
                                  >
                                    Address
                                  </span>
                                  <p
                                    class="c10 c39"
                                    id="accordion-desc-4"
                                  >
                                    Define all allowed actions for the api::address plugin.
                                  </p>
                                </span>
                              </button>
                              <div
                                class="c7 c9 c46"
                              >
                                <span
                                  aria-hidden="true"
                                  class="c7 c52 c53"
                                  data-strapi-dropdown="true"
                                >
                                  <svg
                                    class="c54 c55"
                                    fill="none"
                                    height="1rem"
                                    viewBox="0 0 14 8"
                                    width="1rem"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      clip-rule="evenodd"
                                      d="M14 .889a.86.86 0 0 1-.26.625L7.615 7.736A.834.834 0 0 1 7 8a.834.834 0 0 1-.615-.264L.26 1.514A.861.861 0 0 1 0 .889c0-.24.087-.45.26-.625A.834.834 0 0 1 .875 0h12.25c.237 0 .442.088.615.264a.86.86 0 0 1 .26.625Z"
                                      fill="#32324D"
                                      fill-rule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="c56"
                >
                  <div
                    class="c57"
                    style="min-height: 100%;"
                  >
                    <div
                      class="c7 c38"
                    >
                      <h3
                        class="c10 c22"
                      >
                        Advanced settings
                      </h3>
                      <p
                        class="c10 c39"
                      >
                        Select the application's actions or the plugin's actions and click on the cog icon to display the bound route
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    `);
  });

  it("can edit a users-permissions role's name and description", async () => {
    const { getByLabelText, getByRole, getByTestId, getAllByText } = makeAndRenderApp();
    const user = userEvent.setup();

    // Check loading screen
    const loader = getByTestId('loader');
    expect(loader).toBeInTheDocument();

    // After loading, check other elements
    await waitForElementToBeRemoved(loader);
    const saveButton = getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    const nameField = getByLabelText(/name/i);
    expect(nameField).toBeInTheDocument();
    const descriptionField = getByLabelText(/description/i);
    expect(descriptionField).toBeInTheDocument();

    // Shows error when name is missing
    await user.clear(nameField);
    expect(nameField).toHaveValue('');
    await user.clear(descriptionField);
    expect(descriptionField).toHaveValue('');

    // Show errors after form submit
    await user.click(saveButton);
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    const errorMessages = await getAllByText(/invalid value/i);
    errorMessages.forEach((errorMessage) => expect(errorMessage).toBeInTheDocument());
  });

  it('can toggle the permissions accordions and actions', async () => {
    const user = userEvent.setup();
    // Create app and wait for loading
    const { getByLabelText, queryByText, getByTestId, getByText, getAllByRole } =
      makeAndRenderApp();
    const loader = getByTestId('loader');
    await waitForElementToBeRemoved(loader);

    // Open the collapse
    const collapse = getByText(/define all allowed actions for the api::address plugin/i);
    await user.click(collapse);
    expect(getByLabelText(/select all/i)).toBeInTheDocument();

    // Display the selected action's bound route
    const actionCogButton = getByTestId('action-cog');
    await user.click(actionCogButton);
    expect(getByText(/bound route to/i)).toBeInTheDocument();
    expect(getByText('POST')).toBeInTheDocument();
    expect(getByText('/addresses')).toBeInTheDocument();

    // Select all actions with the "select all" checkbox
    const [selectAllCheckbox, ...actionCheckboxes] = getAllByRole('checkbox');
    expect(selectAllCheckbox.checked).toBe(false);
    await user.click(selectAllCheckbox);
    actionCheckboxes.forEach((actionCheckbox) => {
      expect(actionCheckbox.checked).toBe(true);
    });

    // Close the collapse
    await user.click(collapse);
    expect(queryByText(/select all/i)).not.toBeInTheDocument();
  });
});
