// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:7777/api',
  firebase: {
    apiKey: 'AIzaSyBUzWkqUxxEk35HG6XZ4oJihrzK7JG_tpw',
    authDomain: 'sqrest.firebaseapp.com',
    databaseURL: 'https://sqrest.firebaseio.com',
    projectId: 'sqrest',
    storageBucket: 'sqrest.appspot.com',
    messagingSenderId: '183886257384'
  }
};
