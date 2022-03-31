import { useMutation, useQueryClient } from 'react-query';
import { useNotification } from '@strapi/helper-plugin';

import pluginId from '../pluginId';
import { removeAssetRequest } from '../utils/removeAssetQuery';

const bulkRemoveQuery = assetIds => {
  const promises = assetIds.map(assetId => removeAssetRequest(assetId));

  return Promise.all(promises);
};

export const useBulkRemoveAsset = () => {
  const toggleNotification = useNotification();
  const queryClient = useQueryClient();

  const mutation = useMutation(bulkRemoveQuery, {
    onSuccess: () => {
      queryClient.refetchQueries([pluginId, 'assets'], { active: true });
      queryClient.refetchQueries([pluginId, 'asset-count'], { active: true });

      toggleNotification({
        type: 'success',
        message: {
          id: 'modal.remove.success-label',
          defaultMessage: 'The asset has been successfully removed.',
        },
      });
    },
    onError: error => {
      toggleNotification({ type: 'warning', message: error.message });
    },
  });

  const removeAssets = assetIds => mutation.mutateAsync(assetIds);

  return { ...mutation, removeAssets };
};
