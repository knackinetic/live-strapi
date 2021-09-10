import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNotifyAT } from '@strapi/parts/LiveRegions';
import { useQuery as useURLQuery, useNotification } from '@strapi/helper-plugin';
import { axiosInstance, getRequestUrl, generateStringFromParams } from '../utils';
import useSelectTimestamps from './useSelectTimestamps';

export const useAssets = ({ skipWhen }) => {
  const toggleNotification = useNotification();
  const [, updated_at] = useSelectTimestamps();
  const { notifyStatus } = useNotifyAT();
  const query = useURLQuery();
  const dataRequestURL = getRequestUrl('files');
  const params = generateStringFromParams(query);
  const paramsToSend = params.includes('sort') ? params : params.concat(`&sort=${updated_at}:DESC`);

  const { data, error, isLoading } = useQuery(
    'assets',
    async () => {
      const { data } = await axiosInstance.get(`${dataRequestURL}?${paramsToSend}`);

      return data;
    },
    { enabled: !skipWhen }
  );

  useEffect(() => {
    if (data) {
      notifyStatus('The assets have finished loading');
    }
  }, [data, notifyStatus]);

  useEffect(() => {
    if (error) {
      toggleNotification({
        type: 'warning',
        message: { id: 'notification.error' },
      });
    }
  }, [error, toggleNotification]);

  return { data, error, isLoading };
};
