# Ant-Design template for ReactJS project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
You can't modify or access the webpack configurations if using `CRA` to create your React project. So inside this source-code, we install the `vite` or override the webpack in case of adjusting configurations.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `yarn gen-swagger`

Make the service folder based on the swagger file (in `json` format)

```bash
yarn gen-swagger --source=./swagger-002.json --target=./src/service
```

When the command is executed, new folder `service` will be created inside your `src` folder.  
The swagger models must be in well-defined so the `axios-swagger-codegen` will help us to generate the interface also the class services for defined models

**Note:** Support remote url or static in the future

## Learn More

To try the source-code and get used to it as fast as possible, we give you some documents about project structure at [here](https://git.dision.office/DISION/antd-template/wiki):

- Project structures overview
- How to create new route and page
- How to align with new generated service

## How to contribute

Run the `storybook` overview components

```bash
yarn storybook
// or
npm run storybook
```

Shorten the way creating new component and start developing new feature

```bash
yarn generate:component --name=<ComponentName>
// or
npm run generate:component --name=<ComponentName>
```

```bash
yarn generate --target=page --name=<ComponentName>
// or
npm run generate --target=page --name=<ComponentName>
```
