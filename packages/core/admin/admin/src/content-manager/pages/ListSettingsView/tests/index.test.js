import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, lightTheme } from '@strapi/parts';
import ListSettingsView from '../index';
import ModelsContext from '../../../contexts/ModelsContext';

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useNotification: jest.fn(),
  useTracking: jest.fn(() => ({ trackUsage: jest.fn() })),
}));

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const layout = {
  attributes: {
    address: {
      type: 'relation',
    },
    averagePrice: {
      type: 'float',
    },
    cover: {
      type: 'media',
    },
    id: {
      type: 'integer',
    },
    since: {
      type: 'date',
    },
  },
  info: {
    label: 'michka',
  },
  metadatas: {
    address: {},
    averagePrice: {},
    cover: {},
    id: {},
    since: {},
  },
  layouts: {
    list: ['id', 'address'],
  },
  options: {},
  settings: {},
  uid: 'api::restaurant.restaurant',
};

const makeApp = history => (
  <Router history={history}>
    <ModelsContext.Provider value={{ refetchData: jest.fn() }}>
      <QueryClientProvider client={client}>
        <IntlProvider messages={{ en: {} }} textComponent="span" locale="en">
          <ThemeProvider theme={lightTheme}>
            <ListSettingsView
              layout={layout}
              slug="api::restaurant.restaurant"
              updateLayout={jest.fn()}
            />
          </ThemeProvider>
        </IntlProvider>
      </QueryClientProvider>
    </ModelsContext.Provider>
  </Router>
);

describe('ADMIN | CM | LV | Configure the view', () => {
  it('renders and matches the snapshot', async () => {
    const history = createMemoryHistory();
    history.push('/content-manager');

    const { container } = render(makeApp(history));
    await waitFor(() => {
      expect(screen.getByText('Configure the view - Michka')).toBeInTheDocument();
    });

    expect(container.firstChild).toMatchInlineSnapshot(`
      .c26 {
        background: #ffffff;
        padding-top: 24px;
        padding-right: 32px;
        padding-bottom: 24px;
        padding-left: 32px;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
      }

      .c27 {
        padding-bottom: 16px;
      }

      .c62 {
        padding-top: 24px;
        padding-bottom: 24px;
      }

      .c21 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #32324d;
      }

      .c22 {
        font-weight: 600;
        line-height: 1.14;
      }

      .c18 {
        padding-right: 8px;
      }

      .c15 {
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

      .c15 svg {
        height: 12px;
        width: 12px;
      }

      .c15 svg > g,
      .c15 svg path {
        fill: #ffffff;
      }

      .c15[aria-disabled='true'] {
        pointer-events: none;
      }

      .c15:after {
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

      .c15:focus-visible {
        outline: none;
      }

      .c15:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c19 {
        height: 100%;
      }

      .c16 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 10px 16px;
        background: #4945ff;
        border: none;
        border: 1px solid #4945ff;
        background: #4945ff;
      }

      .c16 .c17 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c16 .c20 {
        color: #ffffff;
      }

      .c16[aria-disabled='true'] {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c16[aria-disabled='true'] .c20 {
        color: #666687;
      }

      .c16[aria-disabled='true'] svg > g,
      .c16[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c16[aria-disabled='true']:active {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c16[aria-disabled='true']:active .c20 {
        color: #666687;
      }

      .c16[aria-disabled='true']:active svg > g,
      .c16[aria-disabled='true']:active svg path {
        fill: #666687;
      }

      .c16:hover {
        border: 1px solid #7b79ff;
        background: #7b79ff;
      }

      .c16:active {
        border: 1px solid #4945ff;
        background: #4945ff;
      }

      .c29 {
        padding-bottom: 24px;
      }

      .c65 {
        padding-top: 16px;
        padding-right: 16px;
        padding-left: 16px;
        border-radius: 4px;
        border-style: dashed;
        border-width: 1px;
        border-color: #c0c0cf;
      }

      .c72 {
        background: #f6f6f9;
        border-radius: 4px;
        border-color: #eaeaef;
        border: 1px solid #eaeaef;
      }

      .c30 {
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
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .c66 {
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

      .c73 {
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

      .c52 {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        background: transparent;
        border: none;
      }

      .c52:focus {
        outline: none;
      }

      .c49 {
        font-weight: 500;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #32324d;
      }

      .c56 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #666687;
      }

      .c60 {
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #666687;
      }

      .c55 {
        padding-right: 16px;
        padding-left: 16px;
      }

      .c57 {
        padding-left: 12px;
      }

      .c50 {
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

      .c53 {
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

      .c48 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c48 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c48 > * + * {
        margin-top: 4px;
      }

      .c83 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c83 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c83 > * + * {
        margin-top: 0px;
      }

      .c51 {
        position: relative;
        border: 1px solid #dcdce4;
        padding-right: 12px;
        border-radius: 4px;
        background: #ffffff;
        overflow: hidden;
        min-height: 2.5rem;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
      }

      .c51:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c58 {
        background: transparent;
        border: none;
        position: relative;
        z-index: 1;
      }

      .c58 svg {
        height: 0.6875rem;
        width: 0.6875rem;
      }

      .c58 svg path {
        fill: #666687;
      }

      .c59 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        background: none;
        border: none;
      }

      .c59 svg {
        width: 0.375rem;
      }

      .c54 {
        width: 100%;
      }

      .c69 {
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

      .c70 > * {
        margin-left: 0;
        margin-right: 0;
      }

      .c70 > * + * {
        margin-left: 12px;
      }

      .c28 {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25;
        color: #32324d;
      }

      .c79 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #32324d;
      }

      .c80 {
        font-weight: 600;
        line-height: 1.14;
      }

      .c35 {
        font-weight: 500;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #32324d;
      }

      .c42 {
        font-weight: 500;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #b72b1a;
      }

      .c38 {
        background: #ffffff;
        border-radius: 4px;
      }

      .c40 {
        background: #fcecea;
        padding-right: 32px;
        padding-left: 32px;
      }

      .c43 {
        background: #ffffff;
        padding-right: 32px;
        padding-left: 32px;
      }

      .c34 {
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

      .c33 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c33 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c33 > * + * {
        margin-top: 4px;
      }

      .c37 {
        border: 0;
        -webkit-clip: rect(0 0 0 0);
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      .c36 {
        position: relative;
        display: inline-block;
      }

      .c39 {
        height: 2.5rem;
        border: 1px solid #dcdce4;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        overflow: hidden;
        outline: none;
        box-shadow: 0;
        -webkit-transition-property: border-color,box-shadow,fill;
        transition-property: border-color,box-shadow,fill;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
      }

      .c39:focus-within {
        border: 1px solid #4945ff;
        box-shadow: #4945ff 0px 0px 0px 2px;
      }

      .c44 {
        text-transform: uppercase;
        position: relative;
        z-index: 2;
      }

      .c41 {
        text-transform: uppercase;
        border-right: 1px solid #dcdce4;
        position: relative;
        z-index: 2;
      }

      .c45 {
        position: absolute;
        z-index: 1;
        left: 4px;
        top: 4px;
      }

      .c32 {
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
      }

      .c63 {
        background: #eaeaef;
      }

      .c64 {
        height: 1px;
        border: none;
        margin: 0;
      }

      .c1 {
        padding-bottom: 56px;
      }

      .c4 {
        background: #f6f6f9;
        padding-top: 24px;
        padding-right: 56px;
        padding-bottom: 56px;
        padding-left: 56px;
      }

      .c5 {
        padding-bottom: 12px;
      }

      .c25 {
        padding-right: 56px;
        padding-left: 56px;
      }

      .c0 {
        display: grid;
        grid-template-columns: 1fr;
      }

      .c2 {
        overflow-x: hidden;
      }

      .c12 {
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

      .c13 {
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

      .c14 {
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.25;
        color: #32324d;
      }

      .c23 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #666687;
      }

      .c24 {
        font-size: 1rem;
        line-height: 1.5;
      }

      .c9 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #4945ff;
      }

      .c10 {
        font-weight: 600;
        line-height: 1.14;
      }

      .c11 {
        font-weight: 600;
        font-size: 0.6875rem;
        line-height: 1.45;
        text-transform: uppercase;
      }

      .c7 {
        padding-right: 8px;
      }

      .c6 {
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        text-transform: uppercase;
        -webkit-text-decoration: none;
        text-decoration: none;
        position: relative;
        outline: none;
      }

      .c6 svg path {
        fill: #4945ff;
      }

      .c6 svg {
        font-size: 0.625rem;
      }

      .c6:after {
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

      .c6:focus-visible {
        outline: none;
      }

      .c6:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c8 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      .c3 {
        outline: none;
      }

      .c46 {
        display: grid;
        grid-template-columns: repeat(12,1fr);
        gap: 16px;
      }

      .c47 {
        grid-column: span 6;
      }

      .c61 {
        grid-column: span 3;
      }

      .c31 {
        gap: 16px;
      }

      .c76 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 32px;
      }

      .c76:last-child {
        padding: 0 12px;
      }

      .c77 {
        padding: 0 12px;
        border-right: 1px solid #eaeaef;
        cursor: all-scroll;
      }

      .c77 svg {
        width: 0.75rem;
        height: 0.75rem;
      }

      .c74 {
        min-width: 12.5rem;
        cursor: pointer;
      }

      .c74 svg {
        width: 0.625rem;
        height: 0.625rem;
      }

      .c74 svg path {
        fill: #666687;
      }

      .c74:hover {
        background-color: #f0f0ff;
        border-color: #d9d8ff;
      }

      .c74:hover svg path {
        fill: #4945ff;
      }

      .c74:hover .c78 {
        color: #4945ff;
      }

      .c74:hover .c75 {
        border-right: 1px solid #d9d8ff;
      }

      .c71:last-child {
        padding-right: 12px;
      }

      .c67 {
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .c81 {
        -webkit-flex: auto;
        -ms-flex: auto;
        flex: auto;
      }

      .c68 {
        overflow-x: scroll;
        overflow-y: hidden;
      }

      .c82 {
        max-width: 12.5rem;
      }

      @media (max-width:68.75rem) {
        .c47 {
          grid-column: span 12;
        }
      }

      @media (max-width:34.375rem) {
        .c47 {
          grid-column: span;
        }
      }

      @media (max-width:68.75rem) {
        .c61 {
          grid-column: span 12;
        }
      }

      @media (max-width:34.375rem) {
        .c61 {
          grid-column: span;
        }
      }

      <div
        class="c0"
      >
        <div
          class="c1 c2"
        >
          <main
            aria-busy="false"
            aria-labelledby="main-content-title"
            class="c3"
            id="main-content"
            tabindex="-1"
          >
            <form>
              <div
                style="height: 0px;"
              >
                <div
                  class="c4"
                  data-strapi-header="true"
                >
                  <div
                    class="c5"
                  >
                    <a
                      class="c6"
                      href="/content-manager/undefined/api::restaurant.restaurant?page=1&sort=undefined:undefined"
                      id="go-back"
                    >
                      <span
                        aria-hidden="true"
                        class="c7 c8"
                      >
                        <svg
                          fill="none"
                          height="1em"
                          viewBox="0 0 24 24"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24 13.3a.2.2 0 01-.2.2H5.74l8.239 8.239a.2.2 0 010 .282L12.14 23.86a.2.2 0 01-.282 0L.14 12.14a.2.2 0 010-.282L11.86.14a.2.2 0 01.282 0L13.98 1.98a.2.2 0 010 .282L5.74 10.5H23.8c.11 0 .2.09.2.2v2.6z"
                            fill="#212134"
                          />
                        </svg>
                      </span>
                      <span
                        class="c9 c10 c11"
                      >
                        Go back
                      </span>
                    </a>
                  </div>
                  <div
                    class="c12"
                  >
                    <div
                      class="c13"
                    >
                      <h1
                        class="c14"
                        id="main-content-title"
                      >
                        Configure the view - Michka
                      </h1>
                    </div>
                    <button
                      aria-disabled="true"
                      class="c15 c16"
                      disabled=""
                      type="submit"
                    >
                      <div
                        aria-hidden="true"
                        class="c17 c18 c19"
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
                        class="c20 c21 c22"
                      >
                        Save
                      </span>
                    </button>
                  </div>
                  <p
                    class="c23 c24"
                  >
                    Define the settings of the list view.
                  </p>
                </div>
              </div>
              <div
                class="c25"
              >
                <div
                  class="c26"
                >
                  <div
                    class="c27"
                  >
                    <h2
                      class="c28"
                    >
                      Settings
                    </h2>
                  </div>
                  <div
                    class="c29 c30 c31"
                    wrap="wrap"
                  >
                    <div
                      class="c32"
                    >
                      <div
                        class="c33"
                      >
                        <div
                          class="c34"
                        >
                          <label
                            class="c35"
                            for="field-1"
                          >
                            Enable search
                          </label>
                        </div>
                        <label
                          class="c36"
                        >
                          <div
                            class="c37"
                          >
                            Enable search
                          </div>
                          <div
                            class="c38 c39"
                          >
                            <div
                              aria-hidden="true"
                              class="c40 c34 c41"
                            >
                              <span
                                class="c42"
                              >
                                off
                              </span>
                            </div>
                            <div
                              aria-hidden="true"
                              class="c43 c34 c44"
                            >
                              <span
                                class="c35"
                              >
                                on
                              </span>
                            </div>
                            <input
                              class="c45"
                              name="settings.searchable"
                              type="checkbox"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div
                      class="c32"
                    >
                      <div
                        class="c33"
                      >
                        <div
                          class="c34"
                        >
                          <label
                            class="c35"
                            for="field-2"
                          >
                            Enable filters
                          </label>
                        </div>
                        <label
                          class="c36"
                        >
                          <div
                            class="c37"
                          >
                            Enable filters
                          </div>
                          <div
                            class="c38 c39"
                          >
                            <div
                              aria-hidden="true"
                              class="c40 c34 c41"
                            >
                              <span
                                class="c42"
                              >
                                off
                              </span>
                            </div>
                            <div
                              aria-hidden="true"
                              class="c43 c34 c44"
                            >
                              <span
                                class="c35"
                              >
                                on
                              </span>
                            </div>
                            <input
                              class="c45"
                              name="settings.filterable"
                              type="checkbox"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div
                      class="c32"
                    >
                      <div
                        class="c33"
                      >
                        <div
                          class="c34"
                        >
                          <label
                            class="c35"
                            for="field-3"
                          >
                            Enable bulk actions
                          </label>
                        </div>
                        <label
                          class="c36"
                        >
                          <div
                            class="c37"
                          >
                            Enable bulk actions
                          </div>
                          <div
                            class="c38 c39"
                          >
                            <div
                              aria-hidden="true"
                              class="c40 c34 c41"
                            >
                              <span
                                class="c42"
                              >
                                off
                              </span>
                            </div>
                            <div
                              aria-hidden="true"
                              class="c43 c34 c44"
                            >
                              <span
                                class="c35"
                              >
                                on
                              </span>
                            </div>
                            <input
                              class="c45"
                              name="settings.bulkable"
                              type="checkbox"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    class="c46"
                  >
                    <div
                      class="c47"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div
                            class="c48"
                          >
                            <span
                              class="c49"
                              for="select-1"
                              id="select-1-label"
                            >
                              Entries per page
                            </span>
                            <div
                              class="c50 c51"
                            >
                              <button
                                aria-describedby="select-1-hint"
                                aria-disabled="false"
                                aria-expanded="false"
                                aria-haspopup="listbox"
                                aria-labelledby="select-1-label select-1-content"
                                class="c52"
                                id="select-1"
                                name="settings.pageSize"
                                type="button"
                              />
                              <div
                                class="c53 c54"
                              >
                                <div
                                  class="c50"
                                >
                                  <div
                                    class="c55"
                                  >
                                    <span
                                      class="c56"
                                      id="select-1-content"
                                    >
                                      Select...
                                    </span>
                                  </div>
                                </div>
                                <div
                                  class="c50"
                                >
                                  
                                  <button
                                    aria-hidden="true"
                                    class="c57 c58 c59"
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
                            <p
                              class="c60"
                              id="select-1-hint"
                            >
                              Note: You can override this value in the Collection Type settings page.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="c61"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div
                            class="c48"
                          >
                            <span
                              class="c49"
                              for="select-2"
                              id="select-2-label"
                            >
                              Default sort attribute
                            </span>
                            <div
                              class="c50 c51"
                            >
                              <button
                                aria-disabled="false"
                                aria-expanded="false"
                                aria-haspopup="listbox"
                                aria-labelledby="select-2-label select-2-content"
                                class="c52"
                                id="select-2"
                                name="settings.defaultSortBy"
                                type="button"
                              />
                              <div
                                class="c53 c54"
                              >
                                <div
                                  class="c50"
                                >
                                  <div
                                    class="c55"
                                  >
                                    <span
                                      class="c56"
                                      id="select-2-content"
                                    >
                                      Select...
                                    </span>
                                  </div>
                                </div>
                                <div
                                  class="c50"
                                >
                                  
                                  <button
                                    aria-hidden="true"
                                    class="c57 c58 c59"
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
                    <div
                      class="c61"
                    >
                      <div
                        class=""
                      >
                        <div>
                          <div
                            class="c48"
                          >
                            <span
                              class="c49"
                              for="select-3"
                              id="select-3-label"
                            >
                              Default sort order
                            </span>
                            <div
                              class="c50 c51"
                            >
                              <button
                                aria-disabled="false"
                                aria-expanded="false"
                                aria-haspopup="listbox"
                                aria-labelledby="select-3-label select-3-content"
                                class="c52"
                                id="select-3"
                                name="settings.defaultSortOrder"
                                type="button"
                              />
                              <div
                                class="c53 c54"
                              >
                                <div
                                  class="c50"
                                >
                                  <div
                                    class="c55"
                                  >
                                    <span
                                      class="c56"
                                      id="select-3-content"
                                    >
                                      Select...
                                    </span>
                                  </div>
                                </div>
                                <div
                                  class="c50"
                                >
                                  
                                  <button
                                    aria-hidden="true"
                                    class="c57 c58 c59"
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
                  <div
                    class="c62"
                  >
                    <hr
                      class="c63 c64"
                    />
                  </div>
                  <div
                    class="c27"
                  >
                    <h2
                      class="c28"
                    >
                      View
                    </h2>
                  </div>
                  <div
                    class="c65 c66"
                  >
                    <div
                      class="c27 c67 c68"
                      size="1"
                    >
                      <div
                        class="c69 c70"
                      >
                        <div
                          class="c71"
                        >
                          <div
                            class="c72 c73 c74"
                          >
                            <div
                              class="c69 c70"
                            >
                              <button
                                aria-label="move id"
                                class="c75 c76 c77"
                                type="button"
                              >
                                <svg
                                  fill="none"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.563 5.587a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M18.487 3.083c-.012.788-.487 1.513-1.229 1.797a1.954 1.954 0 01-2.184-.574A1.943 1.943 0 0114.9 2.11c.4-.684 1.2-1.066 1.981-.927a1.954 1.954 0 011.606 1.9c.011.748 1.17.748 1.158 0A3.138 3.138 0 0017.565.17c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.284 3.575.678 1.124 1.993 1.674 3.273 1.431 1.432-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.158-.006zM16.563 14.372a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M18.487 11.867c-.012.789-.487 1.513-1.229 1.797a1.954 1.954 0 01-2.184-.574 1.943 1.943 0 01-.174-2.196c.4-.684 1.2-1.066 1.981-.927.928.156 1.588.968 1.606 1.9.011.748 1.17.748 1.158 0a3.138 3.138 0 00-2.08-2.914c-1.176-.423-2.567-.029-3.36.933-.83 1.002-.968 2.45-.284 3.575.678 1.124 1.993 1.675 3.273 1.431 1.432-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.158-.005zM16.563 23.392a2.503 2.503 0 100-5.006 2.503 2.503 0 000 5.006z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M18.487 20.89c-.012.787-.487 1.512-1.229 1.796a1.954 1.954 0 01-2.184-.574 1.943 1.943 0 01-.174-2.196c.4-.684 1.2-1.066 1.981-.927.928.156 1.588.967 1.606 1.9.011.748 1.17.748 1.158 0a3.138 3.138 0 00-2.08-2.914c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.284 3.575.678 1.124 1.993 1.674 3.273 1.431 1.432-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.158-.006zM7.378 5.622a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M9.302 3.119c-.011.788-.486 1.512-1.228 1.796a1.954 1.954 0 01-2.185-.574 1.943 1.943 0 01-.173-2.196c.4-.684 1.199-1.066 1.981-.927a1.943 1.943 0 011.605 1.9c.012.748 1.17.748 1.16 0A3.138 3.138 0 008.38.205c-1.176-.423-2.567-.029-3.36.933-.83 1.002-.968 2.45-.285 3.575.678 1.124 1.994 1.675 3.274 1.431 1.431-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.159-.005zM7.378 14.406a2.503 2.503 0 100-5.006 2.503 2.503 0 000 5.006z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M9.302 11.902c-.011.788-.486 1.513-1.228 1.797a1.954 1.954 0 01-2.185-.574 1.943 1.943 0 01-.173-2.196c.4-.684 1.199-1.066 1.981-.927a1.943 1.943 0 011.605 1.9c.012.748 1.17.748 1.16 0A3.138 3.138 0 008.38 8.988c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.285 3.575.678 1.124 1.994 1.674 3.274 1.431 1.431-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.159-.006zM7.378 23.427a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M9.302 20.924c-.011.788-.486 1.513-1.228 1.797a1.954 1.954 0 01-2.185-.574 1.943 1.943 0 01-.173-2.196c.4-.684 1.199-1.066 1.981-.927.933.156 1.594.967 1.605 1.9.012.748 1.17.748 1.16 0A3.139 3.139 0 008.38 18.01c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.285 3.569.678 1.124 1.994 1.675 3.274 1.431 1.431-.272 2.428-1.593 2.451-3.019.012-.747-1.147-.747-1.159 0z"
                                    fill="#212134"
                                  />
                                </svg>
                              </button>
                              <span
                                class="c78 c79 c80"
                              >
                                id
                              </span>
                            </div>
                            <div
                              class="c66"
                            >
                              <button
                                aria-label="edit id"
                                class="c76"
                                type="button"
                              >
                                <svg
                                  fill="none"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    d="M23.604 3.514c.528.528.528 1.36 0 1.887l-2.622 2.607-4.99-4.99L18.6.396a1.322 1.322 0 011.887 0l3.118 3.118zM0 24v-4.99l14.2-14.2 4.99 4.99L4.99 24H0z"
                                    fill="#212134"
                                    fill-rule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                aria-label="delete id"
                                class="c76"
                                data-testid="delete-id"
                                type="button"
                              >
                                <svg
                                  fill="none"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M24 2.417L21.583 0 12 9.583 2.417 0 0 2.417 9.583 12 0 21.583 2.417 24 12 14.417 21.583 24 24 21.583 14.417 12 24 2.417z"
                                    fill="#212134"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div
                          class="c71"
                        >
                          <div
                            class="c72 c73 c74"
                          >
                            <div
                              class="c69 c70"
                            >
                              <button
                                aria-label="move address"
                                class="c75 c76 c77"
                                type="button"
                              >
                                <svg
                                  fill="none"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.563 5.587a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M18.487 3.083c-.012.788-.487 1.513-1.229 1.797a1.954 1.954 0 01-2.184-.574A1.943 1.943 0 0114.9 2.11c.4-.684 1.2-1.066 1.981-.927a1.954 1.954 0 011.606 1.9c.011.748 1.17.748 1.158 0A3.138 3.138 0 0017.565.17c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.284 3.575.678 1.124 1.993 1.674 3.273 1.431 1.432-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.158-.006zM16.563 14.372a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M18.487 11.867c-.012.789-.487 1.513-1.229 1.797a1.954 1.954 0 01-2.184-.574 1.943 1.943 0 01-.174-2.196c.4-.684 1.2-1.066 1.981-.927.928.156 1.588.968 1.606 1.9.011.748 1.17.748 1.158 0a3.138 3.138 0 00-2.08-2.914c-1.176-.423-2.567-.029-3.36.933-.83 1.002-.968 2.45-.284 3.575.678 1.124 1.993 1.675 3.273 1.431 1.432-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.158-.005zM16.563 23.392a2.503 2.503 0 100-5.006 2.503 2.503 0 000 5.006z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M18.487 20.89c-.012.787-.487 1.512-1.229 1.796a1.954 1.954 0 01-2.184-.574 1.943 1.943 0 01-.174-2.196c.4-.684 1.2-1.066 1.981-.927.928.156 1.588.967 1.606 1.9.011.748 1.17.748 1.158 0a3.138 3.138 0 00-2.08-2.914c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.284 3.575.678 1.124 1.993 1.674 3.273 1.431 1.432-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.158-.006zM7.378 5.622a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M9.302 3.119c-.011.788-.486 1.512-1.228 1.796a1.954 1.954 0 01-2.185-.574 1.943 1.943 0 01-.173-2.196c.4-.684 1.199-1.066 1.981-.927a1.943 1.943 0 011.605 1.9c.012.748 1.17.748 1.16 0A3.138 3.138 0 008.38.205c-1.176-.423-2.567-.029-3.36.933-.83 1.002-.968 2.45-.285 3.575.678 1.124 1.994 1.675 3.274 1.431 1.431-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.159-.005zM7.378 14.406a2.503 2.503 0 100-5.006 2.503 2.503 0 000 5.006z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M9.302 11.902c-.011.788-.486 1.513-1.228 1.797a1.954 1.954 0 01-2.185-.574 1.943 1.943 0 01-.173-2.196c.4-.684 1.199-1.066 1.981-.927a1.943 1.943 0 011.605 1.9c.012.748 1.17.748 1.16 0A3.138 3.138 0 008.38 8.988c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.285 3.575.678 1.124 1.994 1.674 3.274 1.431 1.431-.272 2.428-1.593 2.451-3.019.012-.753-1.147-.753-1.159-.006zM7.378 23.427a2.503 2.503 0 100-5.007 2.503 2.503 0 000 5.007z"
                                    fill="#212134"
                                  />
                                  <path
                                    d="M9.302 20.924c-.011.788-.486 1.513-1.228 1.797a1.954 1.954 0 01-2.185-.574 1.943 1.943 0 01-.173-2.196c.4-.684 1.199-1.066 1.981-.927.933.156 1.594.967 1.605 1.9.012.748 1.17.748 1.16 0A3.139 3.139 0 008.38 18.01c-1.176-.423-2.567-.03-3.36.933-.83 1.002-.968 2.45-.285 3.569.678 1.124 1.994 1.675 3.274 1.431 1.431-.272 2.428-1.593 2.451-3.019.012-.747-1.147-.747-1.159 0z"
                                    fill="#212134"
                                  />
                                </svg>
                              </button>
                              <span
                                class="c78 c79 c80"
                              >
                                address
                              </span>
                            </div>
                            <div
                              class="c66"
                            >
                              <button
                                aria-label="edit address"
                                class="c76"
                                type="button"
                              >
                                <svg
                                  fill="none"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    d="M23.604 3.514c.528.528.528 1.36 0 1.887l-2.622 2.607-4.99-4.99L18.6.396a1.322 1.322 0 011.887 0l3.118 3.118zM0 24v-4.99l14.2-14.2 4.99 4.99L4.99 24H0z"
                                    fill="#212134"
                                    fill-rule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                aria-label="delete address"
                                class="c76"
                                data-testid="delete-address"
                                type="button"
                              >
                                <svg
                                  fill="none"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M24 2.417L21.583 0 12 9.583 2.417 0 0 2.417 9.583 12 0 21.583 2.417 24 12 14.417 21.583 24 24 21.583 14.417 12 24 2.417z"
                                    fill="#212134"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="c27 c81 c82"
                    >
                      <div>
                        <div
                          class="c83"
                        >
                          <div
                            class="c50 c51"
                          >
                            <button
                              aria-disabled="false"
                              aria-expanded="false"
                              aria-haspopup="listbox"
                              aria-labelledby="select-4-label select-4-content"
                              class="c52"
                              data-testid="select-fields"
                              id="select-4"
                              type="button"
                            />
                            <div
                              class="c53 c54"
                            >
                              <div
                                class="c50"
                              >
                                <div
                                  class="c55"
                                >
                                  <span
                                    class="c56"
                                    id="select-4-content"
                                  >
                                    Add a field
                                  </span>
                                </div>
                              </div>
                              <div
                                class="c50"
                              >
                                
                                <button
                                  aria-hidden="true"
                                  class="c57 c58 c59"
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
            </form>
          </main>
        </div>
      </div>
    `);
  });

  it('should keep plugins query params when arriving on the page and going back', async () => {
    const history = createMemoryHistory();
    history.push(
      '/content-manager/collectionType/api::category.category/configurations/list?plugins[i18n][locale]=fr'
    );

    const { container } = render(makeApp(history));
    await waitFor(() => {
      expect(screen.getByText('Configure the view - Michka')).toBeInTheDocument();
    });

    expect(history.location.search).toEqual('?plugins[i18n][locale]=fr');
    fireEvent.click(container.querySelector('#go-back'));
    expect(history.location.search).toEqual(
      '?page=1&sort=undefined:undefined&plugins[i18n][locale]=fr'
    );
  });

  it('should show remaining fields in select fields', async () => {
    const history = createMemoryHistory();
    history.push('/content-manager');

    render(makeApp(history), { container: document.body });

    await waitFor(() => {
      expect(screen.getByText('Configure the view - Michka')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('select-fields'));
    // TO DO
    // await waitFor(() => expect(screen.getByText('cover')).toBeInTheDocument());
  });

  it('should delete field', async () => {
    const history = createMemoryHistory();
    history.push('/content-manager');

    const { queryByTestId } = render(makeApp(history));
    await waitFor(() => {
      expect(screen.getByText('Configure the view - Michka')).toBeInTheDocument();
    });

    expect(queryByTestId('delete-id')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('delete-id'));

    expect(queryByTestId('delete-id')).not.toBeInTheDocument();
  });
});
