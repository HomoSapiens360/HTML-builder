const tool = require('node:fs/promises');
const path = require('path');
const fs = require('fs');
const fullPath = path.join(__dirname);
const getFiles = async () => {
  try {
    const files = await tool.readdir(fullPath + '/secret-folder');
    for (const file of files) {
      fs.stat(fullPath + '/secret-folder/' + file, (err, stats) => {
        if (stats.isFile()) {
          const fSize = stats.size;
          const fName = file.substring(0, file.lastIndexOf('.'));
          const fExt = file.substring(file.lastIndexOf('.') + 1);
          console.log(`${fName}-${fExt}-${fSize} b`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}
getFiles();