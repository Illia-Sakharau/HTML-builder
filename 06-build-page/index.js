const fs = require('fs');
const path = require('path');

const srcStylePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');

const bundleHtml = path.join(bundlePath, 'index.html');
const bundleCss = path.join(bundlePath, 'style.css');


// 1. cоздаём папку project-dist
fs.mkdir(bundlePath, () => {});


// 2. собираем HTML
async function createHtml(){
  await fs.promises.unlink(bundleHtml).catch((err) => {});
  await fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err, data) => {
      let htmlText = data;
      const components = htmlText.match(/{{(.*?)}}/g);
      console.log(`Будут заменены: ${components}`);

      components.forEach(component => {
        const componentPath = path.join(componentsPath, `${component.slice(2,-2)}.html`);

        fs.readFile(componentPath, 'utf-8', (err, data) => {
          htmlText = htmlText.replace(component, data);
          fs.writeFile(bundleHtml, htmlText, () => {});
        });      
      })
    }
  );
}
createHtml();



// 3. cобираем стили
async function createCss(){
  await fs.promises.writeFile(bundleCss, '');

  await fs.readdir(srcStylePath, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        if (file.name.slice(-4) === '.css'){
          fs.readFile(
            path.join(srcStylePath, file.name),
            (err, data) => {
              fs.appendFile(bundleCss, data, () => {});
            }
          );
        }
      }
    });
    
  });
}
createCss();

// 4. копируем папку со всеми вложеностями
async function copyFolder(srcFolderPath, distFolderPath) {
  
  await fs.mkdir(distFolderPath, () => {});

  await fs.readdir(distFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
    } else {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          fs.promises.unlink(path.join(distFolderPath, file.name));
        }
      });
    }
  });  

  await fs.readdir(srcFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
    } else {
      files.forEach((file) => {
        if (file.isDirectory()) {
          copyFolder(path.join(srcFolderPath, file.name), path.join(distFolderPath, file.name))
        } else {
          const srcFile = path.join(srcFolderPath, file.name);
          const destFile = path.join(distFolderPath, file.name);
          fs.copyFile(srcFile, destFile, () => {});
        }
      });
    }
  });  
}

copyFolder(path.join(__dirname, 'assets'), path.join(bundlePath, 'assets'));
