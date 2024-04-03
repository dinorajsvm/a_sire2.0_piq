// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Roles } from 'src/app/core/mgntDBconstants';

export const environment = {
  production: false,
  // apiUrl: "http://70.205.1.4:8080/managementDashboard/api/v1/mgntDb",
  // authUrl: "http://70.205.1.4:8080/auth/api/v1/mack/auth",
  // apiUrl: "https://mackdevshore.solverminds.net",
  // authUrl: "https://mackdevshore.solverminds.net/auth/api/v1/mack/auth",
  // apiUrl: 'https://mackdevship.solverminds.net',
  // authUrl: 'https://mackdevship.solverminds.net/auth/api/v1/mack/auth',
  apiUrl: 'https://mackdevshore.solverminds.net',
  authUrl: 'https://mackdevshore.solverminds.net/auth/api/v1/mack/auth',
  // apiUrl: 'https://mackshore.solverminds.net',
  // authUrl: 'https://mackshore.solverminds.net/auth/api/v1/mack/auth',
  // apiUrl: "https://macktesting.solverminds.net/",
  // authUrl: "https://macktesting.solverminds.net/auth/api/v1/mack/auth",
  // apiUrl: 'https://mackstagingship.solverminds.net',
  // authUrl: 'https://mackstagingship.solverminds.net/auth/api/v1/mack/auth',
  // apiUrl: 'https://testkmsmship1.konectsvm.com',
  // authUrl: 'https://testkmsmship1.konectsvm.com/auth/api/v1/mack/auth',
  // apiUrl: 'https://testkmsm.konectsvm.com',
  // authUrl: 'https://testkmsm.konectsvm.com/auth/api/v1/mack/auth',
  //  apiUrl: "http://70.207.7.23:8080/managementDashboard/api/v1/mgntDb",
  // authUrl: "http://70.207.7.21:8080/auth/api/v1/mack/auth",
  //   apiUrl: " https://mackstaging.solverminds.net/managementDashboard/api/v1/mgntDb",
  // authUrl: " https://mackstaging.solverminds.net/auth/api/v1/mack/auth",
  // apiUrl: "https://test.nyk-nibiki.com/managementDashboard/api/v1/mgntDb",
  // authUrl: "https://test.nyk-nibiki.com/auth/api/v1/mack/auth",
  //devApiUrl : "http://70.205.1.4",
  // apiUrl: "https://www.nyk-nibiki.com/managementDashboard/api/v1/mgntDb",
  //  authUrl: "https://www.nyk-nibiki.com/auth/api/v1/mack/auth",
  projectType: Roles.SHORE,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
