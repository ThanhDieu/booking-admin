/*eslint-env node*/

const fs = require('fs');
const args = require('args-parser')(process.argv);

const TEMPLATE_BASE_PATH = 'templates';
const TARGET_PATH = 'src/components/common';
const TEMPLATE_COMPONENT_PATH = `${TEMPLATE_BASE_PATH}/component`;

const { target, name } = args;

/**
 * Usages:
 * 
 *  const s = 'my name is ${name}';
    const result = translate(s, {
      name: 'Mike'
    });
    console.log(result); // Output: 'my name is Mike'
 * 
 * @param {*} s input string
 * @param {*} values key and value to transform
 * @returns 
 */
function transformContent(s, values) {
  // Loop through the keys in the 'values' object
  for (const key in values) {
    // Replace each key in the 's' string with its corresponding value
    s = s.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), values[key]);
  }
  return s;
}

function transformFileName(s, values, ext = '.ts') {
  const fileName = s.replace(/\[(\w+)\]/g, (match, key) => values[key] || match);

  return fileName.replace('.tp', ext);
}

function generateSharedComponent(componentName = 'Exmaple') {
  const files = fs.readdirSync(TEMPLATE_COMPONENT_PATH);
  const targetComponentFilePath = `${TARGET_PATH}/${componentName}`;

  if (!fs.existsSync(targetComponentFilePath)) {
    console.info(`creating folder ${componentName}`);
    fs.mkdirSync(targetComponentFilePath);
  }

  files.map((file) => {
    const content = fs.readFileSync(`${TEMPLATE_COMPONENT_PATH}/${file}`, 'utf-8');

    const componentContent = transformContent(content, {
      name: componentName
    });
    const newFileName = transformFileName(file, {
      name: componentName
    });
    console.info(`writing file ${newFileName}`);
    const newFilePath = `${targetComponentFilePath}/${newFileName}`;

    fs.writeFileSync(newFilePath, componentContent);

    return file;
  });

  console.info(`created new component ${componentName} successfully!`);
}

const options = {
  component: generateSharedComponent
};

options[target](name);
