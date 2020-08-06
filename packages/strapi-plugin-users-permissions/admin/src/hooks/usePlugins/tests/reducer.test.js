import reducer from '../reducer';

describe('ADMIN | HOOKS | USEPERMISSIONS | reducer', () => {
  describe('DEFAULT_ACTION', () => {
    it('should return the initialState', () => {
      const state = {
        test: true,
      };

      expect(reducer(state, {})).toEqual(state);
    });
  });

  describe('GET_DATA_ERROR', () => {
    it('should set isLoading to false is an error occured', () => {
      const action = {
        type: 'GET_DATA_ERROR',
      };
      const initialState = {
        permissions: {},
        routes: {},
        isLoading: true,
      };
      const expected = {
        permissions: {},
        routes: {},
        isLoading: false,
      };

      expect(reducer(initialState, action)).toEqual(expected);
    });
  });

  describe('GET_DATA_SUCCEEDED', () => {
    it('should return the state with the permissions list', () => {
      const action = {
        type: 'GET_DATA_SUCCEEDED',
        permissions: {
          application: {
            controllers: {
              address: {
                count: { enabled: false },
              },
            },
          },
        },
        routes: {
          application: [{ method: 'GET', path: '/addresses' }],
        },
      };
      const initialState = {
        permissions: {},
        isLoading: true,
      };
      const expected = {
        permissions: {
          application: {
            controllers: {
              address: {
                count: { enabled: false },
              },
            },
          },
        },
        routes: {
          application: [{ method: 'GET', path: '/addresses' }],
        },
        isLoading: false,
      };

      expect(reducer(initialState, action)).toEqual(expected);
    });
  });
});
