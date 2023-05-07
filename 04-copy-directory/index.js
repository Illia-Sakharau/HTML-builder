const path = require('path');
const fs = require('fs');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

fs.mkdir(destPath, () => {});

fs.readdir(srcPath, { withFileTypes: true }, (err, srcFiles) => {
  if (err) {
    console.error(err);
  } else {
    srcFiles.forEach((srcFile) => {
      if (!srcFile.isDirectory()) { 
        const srcFilePath = path.join(srcPath, srcFile.name);
        const destFilePath = path.join(destPath, srcFile.name);
        fs.copyFile(srcFilePath, destFilePath, () => {});
      }
    });
    const arrSrcFilesName = srcFiles.map(value => value.name);

    fs.readdir(destPath, { withFileTypes: true }, (err, destFiles) => {
      if (err) {
        console.error(err);
      } else {
        destFiles.forEach((destFile) => {
          
          if (!arrSrcFilesName.includes(destFile.name)) {
            fs.unlink(path.join(destPath, destFile.name), () => {});
          }
        });
      }  
    });
  }  
});
