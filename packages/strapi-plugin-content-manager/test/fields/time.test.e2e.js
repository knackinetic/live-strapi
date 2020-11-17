'use strict';

const { createTestBuilder } = require('../../../../test/helpers/builder');
const { createStrapiInstance } = require('../../../../test/helpers/strapi');
const { createAuthRequest } = require('../../../../test/helpers/request');

const builder = createTestBuilder();
let strapi;
let rq;

const ct = {
  name: 'withtime',
  attributes: {
    field: {
      type: 'time',
    },
  },
};

describe('Test type time', () => {
  beforeAll(async () => {
    await builder.addContentType(ct).build();

    strapi = await createStrapiInstance({ ensureSuperAdmin: true });
    rq = await createAuthRequest({ strapi });
  }, 60000);

  afterAll(async () => {
    await strapi.destroy();
    await builder.cleanup();
  }, 60000);

  test('Create entry with valid value JSON', async () => {
    const res = await rq.post('/content-manager/collection-types/application::withtime.withtime', {
      body: {
        field: '10:10:57.123',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      field: '10:10:57.123',
    });
  });

  test.each(['00:00:00', '01:03:11.2', '01:03:11.93', '01:03:11.123'])(
    'Accepts multiple time formats %s',
    async input => {
      const res = await rq.post(
        '/content-manager/collection-types/application::withtime.withtime',
        {
          body: {
            field: input,
          },
        }
      );

      expect(res.statusCode).toBe(200);
    }
  );

  test.each(['24:11:23', '23:72:11', '12:45:83', 1234, {}, 'test', new Date()])(
    'Throws on invalid time (%s)',
    async input => {
      const res = await rq.post(
        '/content-manager/collection-types/application::withtime.withtime',
        {
          body: {
            field: input,
          },
        }
      );

      expect(res.statusCode).toBe(400);
    }
  );

  test('Reading entry, returns correct value', async () => {
    const res = await rq.get('/content-manager/collection-types/application::withtime.withtime');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    res.body.results.forEach(entry => {
      expect(entry.field).toMatch(/^2[0-3]|[01][0-9]:[0-5][0-9]:[0-5][0-9](.[0-9]{1,3})?$/);
    });
  });

  test('Updating entry sets the right value and format JSON', async () => {
    const res = await rq.post('/content-manager/collection-types/application::withtime.withtime', {
      body: {
        field: '12:11:04',
      },
    });

    const uptimeRes = await rq.put(
      `/content-manager/collection-types/application::withtime.withtime/${res.body.id}`,
      {
        body: {
          field: '13:45:19.123',
        },
      }
    );

    expect(uptimeRes.statusCode).toBe(200);
    expect(uptimeRes.body).toMatchObject({
      id: res.body.id,
      field: '13:45:19.123',
    });
  });
});
