const fs = require('fs');
const path = require('path');

const srcStylePath = path.join(__dirname, 'styles');
const bundleCssPath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.unlink(bundleCssPath, () => {});
fs.writeFile(bundleCssPath, '', () => {});

fs.readdir(srcStylePath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        if (file.name.slice(-4) === '.css'){
          fs.readFile(
            path.join(srcStylePath, file.name),
            (err, data) => {
              if (err) throw err;
              fs.appendFile(bundleCssPath, data, () => {});
            }
          );
        }
      }
    });
  }
});
