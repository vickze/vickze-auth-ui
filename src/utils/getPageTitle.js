import { formatMessage } from 'umi-plugin-react/locale';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { menu, title } from '../defaultSettings';

export const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
};

const getPageTitle = (pathname, breadcrumbNameMap) => {
  const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);
  const titleName = formatMessage({ id: title });
  if (!currRouterData) {
    return titleName;
  }
  const pageName = menu.disableLocal
    ? currRouterData.name
    : formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
  return `${pageName} - ${titleName}`;
};

export default memoizeOne(getPageTitle, isEqual);
