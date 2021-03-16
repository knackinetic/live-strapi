import { request } from 'strapi-helper-plugin';
import generateModelsLinks from './generateModelsLinks';
import checkPermissions from './checkPermissions';

const getCtOrStLinks = async userPermissions => {
  const requestURL = '/content-manager/content-types';

  try {
    const { data } = await request(requestURL, { method: 'GET' });
    const { collectionTypesSectionLinks, singleTypesSectionLinks } = generateModelsLinks(data);

    // Content Types verifications
    const ctLinksPermissionsPromises = checkPermissions(
      userPermissions,
      collectionTypesSectionLinks
    );
    const ctLinksPermissions = await Promise.all(ctLinksPermissionsPromises);
    const authorizedCtLinks = collectionTypesSectionLinks.filter(
      (_, index) => ctLinksPermissions[index]
    );

    // Single Types verifications
    const stLinksPermissionsPromises = checkPermissions(userPermissions, singleTypesSectionLinks);
    const stLinksPermissions = await Promise.all(stLinksPermissionsPromises);
    const authorizedStLinks = singleTypesSectionLinks.filter(
      (_, index) => stLinksPermissions[index]
    );

    return { authorizedCtLinks, authorizedStLinks };
  } catch (err) {
    console.error(err);
    strapi.notification.toggle({
      type: 'warning',
      message: { id: 'notification.error' },
    });

    return { authorizedCtLinks: [], authorizedStLinks: [] };
  }
};

export default getCtOrStLinks;
