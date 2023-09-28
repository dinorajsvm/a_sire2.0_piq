import { Roles } from 'src/app/core/mgntDBconstants';
const hostAddress = `${ window.location.protocol }//${ window.location.hostname + (window.location.port ? ':' + window.location.port : '') }`;

export const environment = {
  production: true,
  apiUrl: hostAddress ,
  authUrl: hostAddress + "/auth/api/v1/mack/auth",
  projectType: Roles.SHIP
};
