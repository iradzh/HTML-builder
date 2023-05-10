const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Files in ${folderPath}:`);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile()) {
        console.log(`${file} - ${stats.size} bytes`);
      }
    });
  });
});
