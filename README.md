# ALF-React
> Build using CRA or [create-react-app](https://create-react-app.dev/)

## Setup
> The setup of this client is automated and fully depended on the configuration contained within `.env` file at the root of the project folder.
> or provided by the environmental variables supplied during the CI/CD build process.

### Install
> Clone the project
- `git clone git@gitlab.rmcloud.com:gabby/alf-react.git`
> Navigate inside the cloned repo
- `cd alf-react`
> Install dependencies
- `npm install`

### Use
> To start development
- `npm start`
> To build the project
- `npm run build`

### Push to production

Accumulate all the changes you want to deploy into the master branch.
Then check beta.brivitymarketer.com to ensure it functions correctly.

while being on master
 - update package.json/package-lock.json bump the version number. Try and represent the MAJOR.MINOR.PATCH version.
 - update the CHANGELOG.md and or README.md
 - commit the above files to git, ```git commit -m "1.2.3 - deploy the wizardsnozzlehopper"
 - push to master ```git push origin master```
 - then checkout out the production branch ```git checkout production``` and make sure all up to date ```git pull origin production```
 - merge master into production ```git merge master```
 - push to production ```git push origin production```
 - watch the build on https://gitlab.rmcloud.com/gabby/alf-react/pipelines for success
 - login to production and see the version in the browser tab reflects the deploy version. Sometimes it caches heavy so page reloads and relogins might help.



### General Info

#### API Service
> The projects api connectivity and mapping is handled by the `api service` found in: `src/services/api`
> Inside it, there is directory object that reflects the supported api endpoint and is used across all redux saga modules
> to connect and interact with them in a uniform manner. For example:
```js
export function* onLoginSaga() {
  try {
    yield put(getOnLoginPending());

    const { path, method } = ApiService.directory.onLogin();
    const response = yield call(ApiService[method], path);

    yield put(getOnLoginSuccess(response));
  } catch (err) {
    yield put(getOnLoginError(err));
  }
}
```

#### AUTH Service
> The projects authentication with auth0 is handled by the `auth service` found in: `src/services/auth`

#### Redux Global State management
> The project utilizes redux state management build using modular ducks pattern.
> This means that each entry in the redux store is contained by and named after directory entry under: `src/store/modules`.
> To add a new entry, create new directory under that folder, any actions, reducer and sagas will be automatically detected
> and added if the directory contains files named actions.js, reducer.js and sagas.js respectively.

#### Automated commit & npm package version increase
> This repo supports automated branch (mainly to be used on master) commits with an npm package version increase.

As such, to commit & version the release, please use the following npm command:
> For patch type:
- `npm run commit patch "Git commit message goes here"`
> For patch minor:
- `npm run commit minor "Git commit message goes here"`
> For patch major:
- `npm run commit major "Git commit message goes here"`
