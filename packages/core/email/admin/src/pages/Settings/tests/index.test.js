import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import server from './utils/server';
import ProtectedSettingsPage from '../index';

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useNotification: jest.fn(),
  useFocusWhenNavigate: jest.fn(),
  CheckPagePermissions: ({ children }) => children,
  useOverlayBlocker: jest.fn(() => ({
    lockApp: jest.fn(),
    unlockApp: jest.fn(),
  })),
}));

const App = (
  <IntlProvider locale="en" messages={{}} defaultLocale="en" textComponent="span">
    <ThemeProvider theme={lightTheme}>
      <ProtectedSettingsPage />
    </ThemeProvider>
  </IntlProvider>
);

describe('Email | Pages | Settings', () => {
  beforeAll(() => server.listen());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
    jest.resetAllMocks();
  });

  it('renders and matches the snapshot', async () => {
    const { container } = render(App);

    await waitFor(() => {
      expect(screen.getByText('Test delivery email address')).toBeInTheDocument();
    });

    expect(container.firstChild).toMatchInlineSnapshot(`
      .c8 {
        background: #ffffff;
        padding-top: 24px;
        padding-right: 32px;
        padding-bottom: 24px;
        padding-left: 32px;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
      }

      .c41 {
        font-weight: 600;
        color: #32324d;
        font-size: 0.75rem;
        line-height: 1.33;
      }

      .c38 {
        padding-right: 8px;
      }

      .c35 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        background: #ffffff;
        border: 1px solid #dcdce4;
        position: relative;
        outline: none;
      }

      .c35 svg {
        height: 12px;
        width: 12px;
      }

      .c35 svg > g,
      .c35 svg path {
        fill: #ffffff;
      }

      .c35[aria-disabled='true'] {
        pointer-events: none;
      }

      .c35:after {
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

      .c35:focus-visible {
        outline: none;
      }

      .c35:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c39 {
        height: 100%;
      }

      .c36 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 8px 16px;
        background: #4945ff;
        border: none;
        border: 1px solid #4945ff;
        background: #4945ff;
      }

      .c36 .c37 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c36 .c40 {
        color: #ffffff;
      }

      .c36[aria-disabled='true'] {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c36[aria-disabled='true'] .c40 {
        color: #666687;
      }

      .c36[aria-disabled='true'] svg > g,
      .c36[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c36[aria-disabled='true']:active {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c36[aria-disabled='true']:active .c40 {
        color: #666687;
      }

      .c36[aria-disabled='true']:active svg > g,
      .c36[aria-disabled='true']:active svg path {
        fill: #666687;
      }

      .c36:hover {
        border: 1px solid #7b79ff;
        background: #7b79ff;
      }

      .c36:active {
        border: 1px solid #4945ff;
        background: #4945ff;
      }

      .c25 {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        background: transparent;
        border: none;
      }

      .c25:focus {
        outline: none;
      }

      .c25[aria-disabled='true'] {
        cursor: not-allowed;
      }

      .c22 {
        font-weight: 600;
        color: #32324d;
        font-size: 0.75rem;
        line-height: 1.33;
      }

      .c29 {
        color: #666687;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.875rem;
        line-height: 1.43;
      }

      .c28 {
        padding-right: 16px;
        padding-left: 16px;
      }

      .c30 {
        padding-left: 12px;
      }

      .c23 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c26 {
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
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c21 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c21 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c21 > * + * {
        margin-top: 4px;
      }

      .c24 {
        position: relative;
        border: 1px solid #dcdce4;
        padding-right: 12px;
        border-radius: 4px;
        background: #ffffff;
        overflow: hidden;
        min-height: 2.5rem;
        color: #666687;
        background: #eaeaef;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
      }

      .c24:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c31 {
        background: transparent;
        border: none;
        position: relative;
        z-index: 1;
      }

      .c31 svg {
        height: 0.6875rem;
        width: 0.6875rem;
      }

      .c31 svg path {
        fill: #666687;
      }

      .c32 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        background: none;
        border: none;
      }

      .c32 svg {
        width: 0.375rem;
      }

      .c27 {
        width: 100%;
      }

      .c7 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c7 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c7 > * + * {
        margin-top: 32px;
      }

      .c9 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c9 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c9 > * + * {
        margin-top: 16px;
      }

      .c10 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c10 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c10 > * + * {
        margin-top: 4px;
      }

      .c17 {
        font-weight: 600;
        color: #32324d;
        font-size: 0.75rem;
        line-height: 1.33;
      }

      .c16 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c18 {
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
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c20 {
        border: none;
        border-radius: 4px;
        padding-left: 16px;
        padding-right: 16px;
        color: #32324d;
        font-weight: 400;
        font-size: 0.875rem;
        display: block;
        width: 100%;
      }

      .c20::-webkit-input-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c20::-moz-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c20:-ms-input-placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c20::placeholder {
        color: #8e8ea9;
        opacity: 1;
      }

      .c20[aria-disabled='true'] {
        background: inherit;
        color: inherit;
      }

      .c20:focus {
        outline: none;
        box-shadow: none;
      }

      .c19 {
        border: 1px solid #dcdce4;
        border-radius: 4px;
        background: #ffffff;
        height: 2.5rem;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        color: #666687;
        background: #eaeaef;
      }

      .c19:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c33 {
        border: 1px solid #dcdce4;
        border-radius: 4px;
        background: #ffffff;
        height: 2.5rem;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
      }

      .c33:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c15 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c15 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c15 > * + * {
        margin-top: 4px;
      }

      .c0 {
        outline: none;
      }

      .c1 {
        background: #f6f6f9;
        padding-top: 56px;
        padding-right: 56px;
        padding-bottom: 56px;
        padding-left: 56px;
      }

      .c6 {
        padding-right: 56px;
        padding-left: 56px;
      }

      .c2 {
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
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c3 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c4 {
        color: #32324d;
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.25;
      }

      .c5 {
        color: #666687;
        font-size: 1rem;
        line-height: 1.5;
      }

      .c13 {
        display: grid;
        grid-template-columns: repeat(12,1fr);
        gap: 20px;
      }

      .c14 {
        grid-column: span 6;
      }

      .c34 {
        grid-column: span 7;
      }

      .c11 {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25;
        color: #32324d;
      }

      .c12 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #32324d;
      }

      @media (max-width:68.75rem) {
        .c14 {
          grid-column: span 12;
        }
      }

      @media (max-width:34.375rem) {
        .c14 {
          grid-column: span;
        }
      }

      @media (max-width:68.75rem) {
        .c34 {
          grid-column: span 12;
        }
      }

      @media (max-width:34.375rem) {
        .c34 {
          grid-column: span;
        }
      }

      <main
        aria-busy="false"
        aria-labelledby="title"
        class="c0"
        id="main-content"
        tabindex="-1"
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
              <div
                class="c3"
              >
                <h1
                  class="c4"
                  id="title"
                >
                  Email settings
                </h1>
              </div>
            </div>
            <p
              class="c5"
            >
              Test the settings for the email plugin
            </p>
          </div>
        </div>
        <div
          class="c6"
        >
          <form>
            <div
              class="c7"
            >
              <div
                class="c8"
              >
                <div
                  class="c9"
                >
                  <div
                    class="c10"
                  >
                    <h2
                      class="c11"
                    >
                      Configuration
                    </h2>
                    <span
                      class="c12"
                    >
                      Configuration
                    </span>
                  </div>
                  <div
                    class="c13"
                  >
                    <div
                      class="c14"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div>
                            <div
                              class="c15"
                            >
                              <div
                                class="c16"
                              >
                                <label
                                  class="c17"
                                  for="textinput-3"
                                >
                                  Default shipper email
                                </label>
                              </div>
                              <div
                                class="c18 c19"
                                disabled=""
                              >
                                <input
                                  aria-disabled="true"
                                  aria-invalid="false"
                                  class="c20"
                                  id="textinput-3"
                                  name="shipper-email"
                                  placeholder="ex: Strapi No-Reply <no-reply@strapi.io>"
                                  value=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="c14"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div>
                            <div
                              class="c15"
                            >
                              <div
                                class="c16"
                              >
                                <label
                                  class="c17"
                                  for="textinput-4"
                                >
                                  Default response email
                                </label>
                              </div>
                              <div
                                class="c18 c19"
                                disabled=""
                              >
                                <input
                                  aria-disabled="true"
                                  aria-invalid="false"
                                  class="c20"
                                  id="textinput-4"
                                  name="response-email"
                                  placeholder="ex: Strapi <example@strapi.io>"
                                  value=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="c14"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div
                            class="c21"
                          >
                            <span
                              class="c22"
                              for="select-2"
                              id="select-2-label"
                            >
                              Email provider
                            </span>
                            <div
                              class="c23 c24"
                              disabled=""
                            >
                              <button
                                aria-disabled="true"
                                aria-expanded="false"
                                aria-haspopup="listbox"
                                aria-labelledby="select-2-label select-2-content"
                                class="c25"
                                id="select-2"
                                name="email-provider"
                                type="button"
                              />
                              <div
                                class="c26 c27"
                              >
                                <div
                                  class="c23"
                                >
                                  <div
                                    class="c28"
                                  >
                                    <span
                                      class="c29"
                                      id="select-2-content"
                                    >
                                      Select...
                                    </span>
                                  </div>
                                </div>
                                <div
                                  class="c23"
                                >
                                  
                                  <button
                                    aria-hidden="true"
                                    class="c30 c31 c32"
                                    tabindex="-1"
                                    type="button"
                                  >
                                    <svg
                                      fill="none"
                                      height="1em"
                                      viewBox="0 0 14 8"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        clip-rule="evenodd"
                                        d="M14 .889a.86.86 0 01-.26.625L7.615 7.736A.834.834 0 017 8a.834.834 0 01-.615-.264L.26 1.514A.861.861 0 010 .889c0-.24.087-.45.26-.625A.834.834 0 01.875 0h12.25c.237 0 .442.088.615.264a.86.86 0 01.26.625z"
                                        fill="#32324D"
                                        fill-rule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
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
                class="c8"
              >
                <div
                  class="c9"
                >
                  <h2
                    class="c11"
                  >
                    Send a test mail
                  </h2>
                  <div
                    class="c13"
                  >
                    <div
                      class="c14"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div>
                            <div
                              class="c15"
                            >
                              <div
                                class="c16"
                              >
                                <label
                                  class="c17"
                                  for="test-address-input"
                                >
                                  Test delivery email address
                                </label>
                              </div>
                              <div
                                class="c18 c33"
                              >
                                <input
                                  aria-disabled="false"
                                  aria-invalid="false"
                                  class="c20"
                                  id="test-address-input"
                                  name="test-address"
                                  placeholder="ex: developer@example.com"
                                  value=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="c34"
                    >
                      <div
                        class=""
                      >
                        <button
                          aria-disabled="false"
                          class="c35 c36"
                          type="submit"
                        >
                          <div
                            aria-hidden="true"
                            class="c37 c38 c39"
                          >
                            <svg
                              fill="none"
                              height="1em"
                              viewBox="0 0 24 24"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.727 2.97a.2.2 0 01.286 0l2.85 2.89a.2.2 0 010 .28L9.554 20.854a.2.2 0 01-.285 0l-9.13-9.243a.2.2 0 010-.281l2.85-2.892a.2.2 0 01.284 0l6.14 6.209L20.726 2.97z"
                                fill="#212134"
                              />
                            </svg>
                          </div>
                          <span
                            class="c40 c41"
                          >
                            Test email
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    `);
  });
});
