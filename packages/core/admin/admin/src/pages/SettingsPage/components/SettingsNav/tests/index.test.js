import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import SettingsNav from '../index';

const menu = [
  {
    id: 'global',
    intlLabel: { id: 'Settings.global', defaultMessage: 'Global Settings' },
    links: [
      {
        intlLabel: { id: 'Settings.application.title', defaultMessage: 'Overview' },
        to: '/settings/application-infos',
        id: '000-application-infos',
        isDisplayed: true,
        permissions: [],
        hasNotification: true,
      },
    ],
  },
  {
    id: 'permissions',
    intlLabel: { id: 'Settings.permissions', defaultMessage: 'Administration Panel' },
    links: [
      {
        intlLabel: { id: 'global.roles', defaultMessage: 'Roles' },
        to: '/settings/roles',
        id: 'roles',
        isDisplayed: true,
        permissions: [
          { action: 'admin::roles.create', subject: null },
          { action: 'admin::roles.update', subject: null },
          { action: 'admin::roles.read', subject: null },
          { action: 'admin::roles.delete', subject: null },
        ],
      },
    ],
  },
  {
    id: 'email',
    intlLabel: { id: 'email.SettingsNav.section-label', defaultMessage: 'Email Plugin' },
    links: [
      {
        intlLabel: { id: 'email.Settings.email.plugin.title', defaultMessage: 'Settings' },
        id: 'settings',
        to: '/settings/email',
        permissions: [{ action: 'plugin::email.settings.read', subject: null }],
        isDisplayed: true,
      },
    ],
  },
  {
    id: 'users-permissions',
    intlLabel: {
      id: 'users-permissions.Settings.section-label',
      defaultMessage: 'Users & Permissions plugin',
    },
    links: [
      {
        intlLabel: { id: 'users-permissions.HeaderNav.link.roles', defaultMessage: 'Roles' },
        id: 'roles',
        to: '/settings/users-permissions/roles',
        permissions: [
          { action: 'plugin::users-permissions.roles.create', subject: null },
          { action: 'plugin::users-permissions.roles.read', subject: null },
        ],
        isDisplayed: true,
      },
    ],
  },
];

const history = createMemoryHistory();

const App = (
  <ThemeProvider theme={lightTheme}>
    <IntlProvider locale="en" messages={{}} textComponent="span">
      <Router history={history}>
        <SettingsNav menu={menu} />
      </Router>
    </IntlProvider>
  </ThemeProvider>
);

describe('SettingsPage || components || SettingsNav', () => {
  it('should render and match snapshot', () => {
    const {
      container: { firstChild },
    } = render(App);

    expect(firstChild).toMatchInlineSnapshot(`
      .c1 {
        padding-top: 24px;
        padding-right: 16px;
        padding-bottom: 8px;
        padding-left: 24px;
      }

      .c5 {
        padding-top: 16px;
      }

      .c6 {
        background: #eaeaef;
      }

      .c9 {
        padding-top: 8px;
        padding-bottom: 16px;
      }

      .c11 {
        padding-top: 8px;
        padding-right: 16px;
        padding-bottom: 8px;
        padding-left: 24px;
      }

      .c16 {
        padding-right: 4px;
      }

      .c18 {
        background: #f6f6f9;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 32px;
      }

      .c21 {
        padding-left: 8px;
      }

      .c23 {
        padding-right: 16px;
      }

      .c0 {
        width: 14.5rem;
        background: #f6f6f9;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        border-right: 1px solid #dcdce4;
        z-index: 1;
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
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
      }

      .c13 {
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

      .c14 {
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
        font-size: 1.125rem;
        line-height: 1.22;
      }

      .c17 {
        color: #666687;
        font-weight: 600;
        font-size: 0.6875rem;
        line-height: 1.45;
        text-transform: uppercase;
      }

      .c22 {
        color: #32324d;
        font-size: 0.875rem;
        line-height: 1.43;
      }

      .c7 {
        height: 1px;
        border: none;
        margin: 0;
      }

      .c8 {
        width: 1.5rem;
        background-color: #dcdce4;
      }

      .c19 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-text-decoration: none;
        text-decoration: none;
        color: #32324d;
      }

      .c19 svg > * {
        fill: #666687;
      }

      .c19.active {
        background-color: #f0f0ff;
        border-right: 2px solid #4945ff;
      }

      .c19.active svg > * {
        fill: #271fe0;
      }

      .c19.active .c3 {
        color: #271fe0;
        font-weight: 500;
      }

      .c19:focus-visible {
        outline-offset: -2px;
      }

      .c20 {
        width: 0.75rem;
        height: 0.25rem;
      }

      .c20 * {
        fill: #666687;
      }

      .c24 {
        width: 0.75rem;
        height: 0.25rem;
      }

      .c24 * {
        fill: #4945ff;
      }

      .c15 {
        border: none;
        padding: 0;
        background: transparent;
      }

      .c12 {
        max-height: 2rem;
      }

      .c12 svg {
        height: 0.25rem;
      }

      .c12 svg path {
        fill: #8e8ea9;
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
        margin-top: 8px;
      }

      <nav
        aria-label="Settings"
        class="c0"
      >
        <div
          class="c1"
        >
          <div
            class="c2"
          >
            <h2
              class="c3 c4"
            >
              Settings
            </h2>
          </div>
          <div
            class="c5"
          >
            <hr
              class="c6 c7 c8"
            />
          </div>
        </div>
        <div
          class="c9"
        >
          <ul
            class="c10"
            spacing="2"
          >
            <li>
              <div
                class=""
              >
                <div
                  class="c11 c12"
                >
                  <div
                    class="c13"
                  >
                    <div
                      class="c14 c15"
                    >
                      <div
                        class="c16"
                      >
                        <span
                          class="c3 c17"
                        >
                          Global Settings
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  id="subnav-list-2"
                >
                  <li>
                    <a
                      class="c18 c19"
                      href="/settings/application-infos"
                    >
                      <div
                        class="c14"
                      >
                        <svg
                          class="c20"
                          fill="none"
                          height="1em"
                          viewBox="0 0 4 4"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            fill="#A5A5BA"
                            height="4"
                            rx="2"
                            width="4"
                          />
                        </svg>
                        <div
                          class="c21"
                        >
                          <span
                            class="c3 c22"
                          >
                            Overview
                          </span>
                        </div>
                      </div>
                      <div
                        class="c14 sc-ehIJor c23"
                      >
                        <svg
                          class="c24"
                          fill="none"
                          height="1em"
                          viewBox="0 0 4 4"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            fill="#A5A5BA"
                            height="4"
                            rx="2"
                            width="4"
                          />
                        </svg>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div
                class=""
              >
                <div
                  class="c11 c12"
                >
                  <div
                    class="c13"
                  >
                    <div
                      class="c14 c15"
                    >
                      <div
                        class="c16"
                      >
                        <span
                          class="c3 c17"
                        >
                          Administration Panel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  id="subnav-list-3"
                >
                  <li>
                    <a
                      class="c18 c19"
                      href="/settings/roles"
                    >
                      <div
                        class="c14"
                      >
                        <svg
                          class="c20"
                          fill="none"
                          height="1em"
                          viewBox="0 0 4 4"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            fill="#A5A5BA"
                            height="4"
                            rx="2"
                            width="4"
                          />
                        </svg>
                        <div
                          class="c21"
                        >
                          <span
                            class="c3 c22"
                          >
                            Roles
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div
                class=""
              >
                <div
                  class="c11 c12"
                >
                  <div
                    class="c13"
                  >
                    <div
                      class="c14 c15"
                    >
                      <div
                        class="c16"
                      >
                        <span
                          class="c3 c17"
                        >
                          Email Plugin
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  id="subnav-list-4"
                >
                  <li>
                    <a
                      class="c18 c19"
                      href="/settings/email"
                    >
                      <div
                        class="c14"
                      >
                        <svg
                          class="c20"
                          fill="none"
                          height="1em"
                          viewBox="0 0 4 4"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            fill="#A5A5BA"
                            height="4"
                            rx="2"
                            width="4"
                          />
                        </svg>
                        <div
                          class="c21"
                        >
                          <span
                            class="c3 c22"
                          >
                            Settings
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div
                class=""
              >
                <div
                  class="c11 c12"
                >
                  <div
                    class="c13"
                  >
                    <div
                      class="c14 c15"
                    >
                      <div
                        class="c16"
                      >
                        <span
                          class="c3 c17"
                        >
                          Users & Permissions plugin
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  id="subnav-list-5"
                >
                  <li>
                    <a
                      class="c18 c19"
                      href="/settings/users-permissions/roles"
                    >
                      <div
                        class="c14"
                      >
                        <svg
                          class="c20"
                          fill="none"
                          height="1em"
                          viewBox="0 0 4 4"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            fill="#A5A5BA"
                            height="4"
                            rx="2"
                            width="4"
                          />
                        </svg>
                        <div
                          class="c21"
                        >
                          <span
                            class="c3 c22"
                          >
                            Roles
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    `);
  });
});
