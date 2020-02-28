import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import useFetch from '../useFetch';

describe('ADMIN | containers | MarketPlacePage | useFetch', () => {
  it('should perform a GET request', async () => {
    const mock = new MockAdapter(axios);
    const mockData = [{ ok: true }];
    mock.onGet().replyOnce(200, mockData);

    const { result, waitForNextUpdate } = renderHook(() => useFetch());

    expect(result.current.isLoading).toBeTruthy();

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeFalsy();
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle the errors correctly', async () => {
    const mock = new MockAdapter(axios);

    mock.onGet().replyOnce(() => {
      return new Promise((_, reject) => {
        reject(new Error(''));
      });
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetch());

    expect(result.current.isLoading).toBeTruthy();

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });
});
