'use strict';

const fs = require('fs');
const path = require('path');

const { createTestBuilder } = require('../../../../../test/helpers/builder');
const { createStrapiInstance } = require('../../../../../test/helpers/strapi');
const { createAuthRequest } = require('../../../../../test/helpers/request');

const builder = createTestBuilder();
let strapi;
let rq;

describe('Dimensions are populated when uploading an image', () => {
  beforeAll(async () => {
    strapi = await createStrapiInstance();
    rq = await createAuthRequest({ strapi });
  });

  afterAll(async () => {
    await strapi.destroy();
    await builder.cleanup();
  });

  test.each([['.jpg'], ['.png'], ['.webp'], ['.tiff'], ['.svg'], ['.gif']])(
    'Dimensions are populated for %s',
    async ext => {
      const res = await rq({
        method: 'POST',
        url: '/upload',
        formData: { files: fs.createReadStream(path.join(__dirname, `../utils/strapi${ext}`)) },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toMatchObject({
        width: 256,
        height: 256,
        ext,
      });
    }
  );
});
