const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach((file) => {
      if (!file.isDirectory()) { 
        const filePath = path.join(folderPath, file.name);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(err);
          } else {
            const fileName = path.parse(filePath).name;
            const fileExt = path.parse(filePath).ext.slice(1);
            const fileSize = stats.size;

            console.log(`${fileName} - ${fileExt} - ${fileSize}b`);
          }
        });
      }
    });
  }  
});
