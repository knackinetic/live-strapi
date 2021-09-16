/**
 *
 * Tests for DraftAndPublishBadge
 *
 */

/* eslint-disable no-irregular-whitespace */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, lightTheme } from '@strapi/parts';
import { IntlProvider } from 'react-intl';
import { DraftAndPublishBadge } from '../index';

const makeApp = props => (
  <ThemeProvider theme={lightTheme}>
    <IntlProvider locale="en" messages={{}} defaultLocale="en">
      <DraftAndPublishBadge {...props} />
    </IntlProvider>
  </ThemeProvider>
);

describe('<DraftAndPublishBadge />', () => {
  it('renders and matches the snapshot', () => {
    const App = makeApp({ hasDraftAndPublish: true, isPublished: true });

    const {
      container: { firstChild },
    } = render(App);

    expect(firstChild).toMatchInlineSnapshot(`
      .c0 {
        background: #eafbe7;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 20px;
        border-radius: 4px;
        border: 1px solid #c6f0c2;
      }

      .c3 {
        padding-left: 12px;
      }

      .c1 {
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
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #2f6846;
      }

      .c5 {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #2f6846;
      }

      .c2 {
        width: 0.375rem;
        height: 0.375rem;
      }

      <aside
        class="c0"
      >
        <div
          class="c1 "
        >
          <svg
            class="c2"
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
            class="c3"
          >
            <span
              class="c4"
            >
              Editing
               
            </span>
            <span
              class="c5"
            >
              published version
            </span>
          </div>
        </div>
      </aside>
    `);
  });

  it('should show the draft design when it is not published', () => {
    const App = makeApp({ hasDraftAndPublish: true, isPublished: false });

    const {
      container: { firstChild },
    } = render(App);

    expect(firstChild).toMatchInlineSnapshot(`
      .c0 {
        background: #eaf5ff;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 20px;
        border-radius: 4px;
        border: 1px solid #b8e1ff;
      }

      .c3 {
        padding-left: 12px;
      }

      .c1 {
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
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #006096;
      }

      .c5 {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #006096;
      }

      .c2 {
        width: 0.375rem;
        height: 0.375rem;
      }

      .c2 * {
        fill: #0c75af;
      }

      <aside
        class="c0"
      >
        <div
          class="c1 "
        >
          <svg
            class="c2"
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
            class="c3"
          >
            <span
              class="c4"
            >
              Editing
               
            </span>
            <span
              class="c5"
            >
              draft version
            </span>
          </div>
        </div>
      </aside>
    `);
  });

  it('should show return null when hasDraftAndPublish is falsy', () => {
    const App = makeApp({ hasDraftAndPublish: false, isPublished: false });

    const { queryByText } = render(App);

    expect(queryByText('Editing')).not.toBeInTheDocument();
  });
});
