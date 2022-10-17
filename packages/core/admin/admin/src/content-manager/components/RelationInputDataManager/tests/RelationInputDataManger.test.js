import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { QueryClientProvider, QueryClient } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useRelation } from '../../../hooks/useRelation';

import { RelationInputDataManager } from '..';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

jest.mock('../../../hooks/useRelation', () => ({
  useRelation: jest.fn().mockReturnValue({
    relations: {
      data: {
        pages: [
          {
            results: [
              {
                id: 1,
                title: 'Relation 1',
              },

              {
                id: 2,
                title: 'Relation 2',
              },
            ],

            pagination: {
              page: 1,
              pageCount: 2,
            },
          },
        ],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isSuccess: true,
      status: 'success',
    },

    search: {
      data: {
        pages: [
          {
            results: [
              {
                id: 11,
                title: 'Search 1',
              },

              {
                id: 22,
                title: 'Search 2',
              },
            ],
          },
        ],
      },
      isFetchingNextPage: false,
      isLoading: false,
      isSuccess: true,
      status: 'success',
    },

    searchFor: jest.fn(),
  }),
}));

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useCMEditViewDataManager: jest.fn().mockReturnValue({
    isCreatingEntry: true,
    createActionAllowedFields: ['relation'],
    readActionAllowedFields: ['relation'],
    updateActionAllowedFields: ['relation'],
    slug: 'test',
    initialData: {},
    loadRelation: jest.fn(),
    connectRelation: jest.fn(),
    disconnectRelation: jest.fn(),
  }),
}));

const setup = (props) =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <IntlProvider locale="en">
            <RelationInputDataManager
              description="Description"
              intlLabel={{
                id: 'label',
                defaultMessage: 'Label',
              }}
              labelAction={<>Action</>}
              mainField={{
                name: 'relation',
                schema: {
                  type: 'relation',
                },
              }}
              name="relation"
              placeholder={{
                id: 'placeholder',
                defaultMessage: 'Placeholder',
              }}
              relationType="oneToOne"
              size={6}
              targetModel="something"
              queryInfos={{
                shouldDisplayRelationLink: true,
              }}
              {...props}
            />
          </IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

describe('RelationInputDataManager', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Does pass through props from the CM', async () => {
    const { findByText } = setup();

    expect(await findByText('Label')).toBeInTheDocument();
    expect(await findByText('Description')).toBeInTheDocument();
    expect(await findByText('Action')).toBeInTheDocument();
    expect(await findByText('Placeholder')).toBeInTheDocument();
  });

  test('Does pass through an error from the CM', async () => {
    const { findByText } = setup({
      error: 'Error',
    });

    expect(await findByText('Error')).toBeInTheDocument();
  });

  test('Sets the disabled prop for morphed relations', async () => {
    const { container } = setup({
      relationType: 'morph',
    });

    expect(container.querySelector('input')).toHaveAttribute('disabled');
  });

  test('Passes down defaultParams to the relation and search endpoints', async () => {
    setup({
      queryInfos: {
        defaultParams: {
          something: true,
        },
        shouldDisplayRelationLink: true,
      },
    });

    expect(useRelation).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        search: expect.objectContaining({
          pageParams: expect.objectContaining({
            something: true,
          }),
        }),
        relation: expect.objectContaining({
          pageParams: expect.objectContaining({
            something: true,
          }),
        }),
      })
    );
  });

  test('Sets the disabled prop for non editable relations (edit entity)', async () => {
    const { container } = setup({
      editable: false,
    });

    expect(container.querySelector('input')).toHaveAttribute('disabled');
  });

  test('Sets the disabled prop for non editable relations (create entity)', async () => {
    const { container } = setup({
      isCreatingEntry: true,
      editable: false,
    });

    expect(container.querySelector('input')).toHaveAttribute('disabled');
  });

  test('Sets the disabled prop if the user does not have all permissions', async () => {
    useCMEditViewDataManager.mockReturnValueOnce({
      isCreatingEntry: false,
      createActionAllowedFields: [],
      readActionAllowedFields: ['relation'],
      updateActionAllowedFields: [],
      slug: 'test',
      initialData: {},
      loadRelation: jest.fn(),
    });

    const { container } = setup({
      isFieldAllowed: false,
      isFieldReadable: true,
    });

    expect(container.querySelector('input')).toHaveAttribute('disabled');
  });

  test('Renders <NotAllowedInput /> if entity is created and field is not allowed', async () => {
    useCMEditViewDataManager.mockReturnValueOnce({
      isCreatingEntry: true,
      createActionAllowedFields: [],
      readActionAllowedFields: [],
      updateActionAllowedFields: [],
      slug: 'test',
      initialData: {},
      loadRelation: jest.fn(),
    });

    const { container } = setup({
      isFieldReadable: true,
    });

    expect(container.querySelector('input')).toHaveAttribute(
      'placeholder',
      'No permissions to see this field'
    );
  });

  test('Renders <NotAllowedInput /> if entity is edited and field is not allowed and not readable', async () => {
    useCMEditViewDataManager.mockReturnValueOnce({
      isCreatingEntry: false,
      createActionAllowedFields: [],
      readActionAllowedFields: [],
      updateActionAllowedFields: [],
      slug: 'test',
      initialData: {},
      loadRelation: jest.fn(),
    });

    const { container } = setup();

    expect(container.querySelector('input')).toHaveAttribute(
      'placeholder',
      'No permissions to see this field'
    );
  });

  // we can assume relations have been normalized properly, if the title
  // attribute was copied into the mainField of a relation and rendered
  test('Normalizes relations', async () => {
    const { findAllByText } = setup({
      mainField: {
        name: 'title',
        schema: {
          type: 'relation',
        },
      },
    });

    const nodes = await findAllByText('Relation 1');

    // ever relation has an associated tooltip
    expect(nodes.length).toBe(2);
    expect(nodes[0]).toBeInTheDocument();
  });

  test('Disconnect new entity', async () => {
    const { disconnectRelation } = useCMEditViewDataManager();
    const { findByTestId } = setup();

    await act(async () => {
      fireEvent.click(await findByTestId('remove-relation-1'));
    });

    expect(disconnectRelation).toBeCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: expect.objectContaining({
            id: 1,
          }),
        }),
      })
    );
  });

  test('Do not render Load More when an entity is created', async () => {
    const { queryByText } = setup();

    expect(await queryByText('Load More')).not.toBeInTheDocument();
  });

  test('Load more entities', async () => {
    const { relations } = useRelation();

    useCMEditViewDataManager.mockReturnValueOnce({
      isCreatingEntry: false,
      createActionAllowedFields: ['relation'],
      readActionAllowedFields: ['relation'],
      updateActionAllowedFields: ['relation'],
      slug: 'test',
      initialData: {},
      loadRelation: jest.fn(),
    });

    const { queryByText } = setup();
    const loadMoreNode = await queryByText('Load More');

    expect(loadMoreNode).toBeInTheDocument();

    act(() => {
      fireEvent.click(loadMoreNode);
    });

    expect(relations.fetchNextPage).toBeCalledTimes(1);
  });

  test('Open search', async () => {
    const { searchFor } = useRelation();
    const { container } = setup();

    act(() => {
      const target = container.querySelector('input');
      fireEvent.keyDown(target, { key: 'ArrowDown', code: 'ArrowDown' });
    });

    screen.logTestingPlaygroundURL();

    expect(searchFor).toBeCalledWith('', { idsToInclude: undefined, idsToOmit: undefined });
  });

  test('Connect new entity', async () => {
    const { connectRelation } = useCMEditViewDataManager();
    const { container, findByText } = setup({
      mainField: {
        name: 'title',
        schema: {
          type: 'relation',
        },
      },
    });

    act(() => {
      fireEvent.change(container.querySelector('input'), {
        target: { value: 'search' },
      });
    });

    const searchResult = await findByText('Search 1');

    act(() => {
      fireEvent.click(searchResult);
    });

    expect(connectRelation).toBeCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: expect.objectContaining({
            id: 11,
          }),
        }),
      })
    );
  });
});
