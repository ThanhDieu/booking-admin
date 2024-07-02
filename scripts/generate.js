/*eslint-env node*/

const fs = require('fs');
const args = require('args-parser')(process.argv);

const { target, name } = args;

function uppercaseFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePage(pageName) {
  const baseTemplateSrc = 'templates/page';
  const targetComponentDest = `src/pages/${pageName}`;

  fs.cpSync(baseTemplateSrc, targetComponentDest, { overwrite: true, recursive: true });

  const componentIndexContent = fs.readFileSync(`${targetComponentDest}/index.tsx`, 'utf8');
  const componentTypesIndexContent = fs.readFileSync(
    `${targetComponentDest}/index.types.ts`,
    'utf8'
  );
  // const componentStoriesIndexContent = fs.readFileSync(
  //   `${targetComponentDest}/index.stories.tsx`,
  //   'utf8'
  // );

  fs.writeFileSync(
    `${targetComponentDest}/index.tsx`,
    componentIndexContent.replaceAll('Page', pageName)
  );
  fs.writeFileSync(
    `${targetComponentDest}/index.types.ts`,
    componentTypesIndexContent.replaceAll('Page', pageName)
  );
  // fs.writeFileSync(
  //   `${targetComponentDest}/index.stories.tsx`,
  //   componentStoriesIndexContent.replaceAll('Sample', pageName)
  // );
}

function generateSlice(modelName) {
  const baseTemplateSrc = 'templates/slice';
  const targetModelDest = `src/store/booking/${modelName}`;
  const rootSliceDest = `src/store/booking/index.ts`;
  fs.cpSync(baseTemplateSrc, targetModelDest, { overwrite: true, recursive: true });

  const thunkContent = fs.readFileSync(`${targetModelDest}/thunks.ts`, 'utf8');
  fs.writeFileSync(
    `${targetModelDest}/thunks.ts`,
    thunkContent.replaceAll('sample', modelName).replaceAll('Sample', uppercaseFirstChar(modelName))
  );

  const reducerContent = fs.readFileSync(`${targetModelDest}/reducer.ts`, 'utf8');
  fs.writeFileSync(
    `${targetModelDest}/reducer.ts`,
    reducerContent
      .replaceAll('sample', modelName)
      .replaceAll('Sample', uppercaseFirstChar(modelName))
  );

  const appRootSliceContent = fs.readFileSync(rootSliceDest, 'utf8');
  fs.writeFileSync(
    rootSliceDest,
    appRootSliceContent
      .replace('//_import', `import {${modelName}Slice} from './${modelName}'\n//_import`)
      .replace('//_slice', `${modelName}: ${modelName}Slice.reducer,\n//_slice`)
  );
}

function generateService(serviceName) {
  const baseTemplateSrc = 'templates/service';
  const targetModelDest = `src/services/${serviceName}`;

  fs.cpSync(baseTemplateSrc, targetModelDest, { overwrite: true, recursive: true });
  const indexContent = fs.readFileSync(`${targetModelDest}/index.ts`, 'utf8');
  fs.writeFileSync(
    `${targetModelDest}/index.ts`,
    indexContent.replaceAll('sample', serviceName).replaceAll('Sample', serviceName)
  );

  const typeContent = fs.readFileSync(`${targetModelDest}/type.ts`, 'utf8');
  fs.writeFileSync(`${targetModelDest}/type.ts`, typeContent.replaceAll('Sample', serviceName));
}

function generate() {
  switch (target) {
    case 'page':
      generatePage(name);
      break;
    case 'slice':
      generateSlice(name);
      break;
    case 'service':
      generateService(name);
      break;
    default:
      break;
  }
}

generate();
