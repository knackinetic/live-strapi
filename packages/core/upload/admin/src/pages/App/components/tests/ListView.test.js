import React from 'react';
import { ThemeProvider, lightTheme } from '@strapi/parts';
import { render as renderTL } from '@testing-library/react';
import { ListView } from '../ListView';
import en from '../../../../translations/en.json';

jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  getTrad: x => x,
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: jest.fn(({ id }) => en[id]) }),
}));

const data = [
  {
    id: 1,
    name: 'strapi-cover_1fabc982ce.png',
    alternativeText: '',
    caption: '',
    width: 1066,
    height: 551,
    formats: {
      thumbnail: {
        name: 'thumbnail_strapi-cover_1fabc982ce.png',
        hash: 'thumbnail_strapi_cover_1fabc982ce_5b43615ed5',
        ext: '.png',
        mime: 'image/png',
        width: 245,
        height: 127,
        size: 3.37,
        path: null,
        url: '/uploads/thumbnail_strapi_cover_1fabc982ce_5b43615ed5.png',
      },
      large: {
        name: 'large_strapi-cover_1fabc982ce.png',
        hash: 'large_strapi_cover_1fabc982ce_5b43615ed5',
        ext: '.png',
        mime: 'image/png',
        width: 1000,
        height: 517,
        size: 22.43,
        path: null,
        url: '/uploads/large_strapi_cover_1fabc982ce_5b43615ed5.png',
      },
      medium: {
        name: 'medium_strapi-cover_1fabc982ce.png',
        hash: 'medium_strapi_cover_1fabc982ce_5b43615ed5',
        ext: '.png',
        mime: 'image/png',
        width: 750,
        height: 388,
        size: 14.62,
        path: null,
        url: '/uploads/medium_strapi_cover_1fabc982ce_5b43615ed5.png',
      },
      small: {
        name: 'small_strapi-cover_1fabc982ce.png',
        hash: 'small_strapi_cover_1fabc982ce_5b43615ed5',
        ext: '.png',
        mime: 'image/png',
        width: 500,
        height: 258,
        size: 8.38,
        path: null,
        url: '/uploads/small_strapi_cover_1fabc982ce_5b43615ed5.png',
      },
    },
    hash: 'strapi_cover_1fabc982ce_5b43615ed5',
    ext: '.png',
    mime: 'image/png',
    size: 6.85,
    url: '/uploads/strapi_cover_1fabc982ce_5b43615ed5.png',
    previewUrl: null,
    provider: 'local',
    provider_metadata: null,
    created_at: '2021-09-14T07:32:50.816Z',
    updated_at: '2021-09-14T07:32:50.816Z',
  },
  {
    id: 5,
    name: 'mov_bbb.mp4',
    alternativeText: '',
    caption: '',
    width: null,
    height: null,
    formats: null,
    hash: 'mov_bbb_2f3907f7aa',
    ext: '.mp4',
    mime: 'video/mp4',
    size: 788.49,
    url: '/uploads/mov_bbb_2f3907f7aa.mp4',
    previewUrl: null,
    provider: 'local',
    provider_metadata: null,
    created_at: '2021-09-14T07:48:30.882Z',
    updated_at: '2021-09-14T07:48:30.882Z',
  },
  {
    id: 6,
    name: 'CARTE MARIAGE AVS - Printemps.pdf',
    alternativeText: '',
    caption: '',
    width: null,
    height: null,
    formats: null,
    hash: 'CARTE_MARIAGE_AVS_Printemps_1f87b19e18',
    ext: '.pdf',
    mime: 'application/pdf',
    size: 422.37,
    url: '/uploads/CARTE_MARIAGE_AVS_Printemps_1f87b19e18.pdf',
    previewUrl: null,
    provider: 'local',
    provider_metadata: null,
    created_at: '2021-09-14T07:51:59.845Z',
    updated_at: '2021-09-14T07:51:59.845Z',
  },
];

describe('MediaLibrary / ListView', () => {
  it('snapshots the listview', () => {
    const { container } = renderTL(
      <ThemeProvider theme={lightTheme}>
        <ListView assets={data} />
      </ThemeProvider>
    );

    expect(container).toMatchInlineSnapshot(`
      .c27 {
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

      .c0 {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
        grid-gap: 16px;
      }

      .c1 {
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
      }

      .c6 {
        padding-top: 8px;
        padding-right: 12px;
        padding-bottom: 8px;
        padding-left: 12px;
      }

      .c13 {
        background: #f6f6f9;
        color: #666687;
        padding: 4px;
        border-radius: 4px;
      }

      .c21 {
        background: #32324d;
        color: #ffffff;
        padding: 4px;
        border-radius: 4px;
      }

      .c2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c7 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
      }

      .c19 {
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

      .c5 {
        margin: 0;
        padding: 0;
        max-height: 100%;
        max-width: 100%;
      }

      .c4 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        height: 10.25rem;
        width: 100%;
        background: repeating-conic-gradient(#f6f6f9 0% 25%,transparent 0% 50%) 50% / 20px 20px;
      }

      .c9 {
        font-weight: 500;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #32324d;
      }

      .c10 {
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #666687;
      }

      .c16 {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.43;
        color: #32324d;
      }

      .c23 {
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1.33;
        color: #ffffff;
      }

      .c17 {
        font-weight: 600;
        line-height: 1.14;
      }

      .c18 {
        font-weight: 600;
        font-size: 0.6875rem;
        line-height: 1.45;
        text-transform: uppercase;
      }

      .c14 {
        display: inline-block;
      }

      .c12 {
        margin-left: auto;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }

      .c15 {
        margin-left: 4px;
      }

      .c8 {
        word-break: break-all;
      }

      .c3 {
        position: relative;
        border-bottom: 1px solid #eaeaef;
      }

      .c22 {
        position: absolute;
        bottom: 4px;
        right: 4px;
      }

      .c11 {
        text-transform: uppercase;
      }

      .c20 canvas {
        display: block;
        max-width: 100%;
        max-height: 10.25rem;
      }

      .c24 {
        text-transform: uppercase;
      }

      .c26 {
        text-transform: uppercase;
      }

      .c25 svg {
        font-size: 3rem;
      }

      <div>
        <div
          class=""
        >
          <div
            class="c0"
          >
            <article
              aria-labelledby="card-1-title"
              class="c1"
              tabindex="0"
            >
              <div
                class="c2 c3"
              >
                <div
                  class="c4"
                >
                  <img
                    aria-hidden="true"
                    class="c5"
                    src="http://localhost:1337/uploads/thumbnail_strapi_cover_1fabc982ce_5b43615ed5.png"
                  />
                </div>
              </div>
              <div
                class="c6"
              >
                <div
                  class="c7"
                >
                  <div
                    class="c8"
                  >
                    <h2
                      class="c9"
                      id="card-1-title"
                    >
                      strapi-cover_1fabc982ce.png
                    </h2>
                    <div
                      class="c10"
                    >
                      <span
                        class="c11"
                      >
                        png
                      </span>
                      - 551✕1066
                    </div>
                  </div>
                  <div
                    class="c12"
                  >
                    <div
                      class="c13 c14 c15"
                    >
                      <span
                        class="c16 c17 c18"
                      >
                        Image
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <article
              aria-labelledby="card-2-title"
              class="c1"
              tabindex="0"
            >
              <div
                class="c2 c3"
              >
                <div
                  class="c4"
                >
                  <div
                    class="c19"
                  >
                    <div
                      class="c20"
                    >
                      <video
                        src="http://localhost:1337/uploads/mov_bbb_2f3907f7aa.mp4"
                      >
                        <source
                          type="video/mp4"
                        />
                      </video>
                      <canvas />
                    </div>
                  </div>
                </div>
                <time
                  class="c21 c22"
                >
                  <span
                    class="c23"
                  >
                    ...
                  </span>
                </time>
              </div>
              <div
                class="c6"
              >
                <div
                  class="c7"
                >
                  <div
                    class="c8"
                  >
                    <h2
                      class="c9"
                      id="card-2-title"
                    >
                      mov_bbb.mp4
                    </h2>
                    <div
                      class="c10"
                    >
                      <span
                        class="c24"
                      >
                        mp4
                      </span>
                    </div>
                  </div>
                  <div
                    class="c12"
                  >
                    <div
                      class="c13 c14 c15"
                    >
                      <span
                        class="c16 c17 c18"
                      >
                        Video
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <article
              aria-labelledby="card-3-title"
              class="c1"
              tabindex="0"
            >
              <div
                class="c2 c3"
              >
                <div
                  class="c4"
                >
                  <div
                    class="c19"
                  >
                    <span
                      class="c25"
                    >
                      <svg
                        aria-label="CARTE MARIAGE AVS - Printemps.pdf"
                        fill="none"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 22H6.5A3.5 3.5 0 013 18.5V5a3 3 0 013-3h14a1 1 0 011 1v18a1 1 0 01-1 1zm-1-2v-3H6.5a1.5 1.5 0 100 3H19z"
                          fill="#8E8EA9"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="c6"
              >
                <div
                  class="c7"
                >
                  <div
                    class="c8"
                  >
                    <h2
                      class="c9"
                      id="card-3-title"
                    >
                      CARTE MARIAGE AVS - Printemps.pdf
                    </h2>
                    <div
                      class="c10"
                    >
                      <span
                        class="c26"
                      >
                        pdf
                      </span>
                    </div>
                  </div>
                  <div
                    class="c12"
                  >
                    <div
                      class="c13 c14 c15"
                    >
                      <span
                        class="c16 c17 c18"
                      >
                        Doc
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        <div
          class="c27"
        >
          <p
            aria-live="polite"
            aria-relevant="all"
            id="live-region-log"
            role="log"
          />
          <p
            aria-live="polite"
            aria-relevant="all"
            id="live-region-status"
            role="status"
          />
          <p
            aria-live="assertive"
            aria-relevant="all"
            id="live-region-alert"
            role="alert"
          />
        </div>
      </div>
    `);
  });
});
