const tool = require('node:fs/promises');
const path = require('path');
const fs = require('fs');
const fullPath = path.join(__dirname);
const bundleFilePath = `${fullPath}/project-dist/bundle.css`;
const pathToCssFiles = `${fullPath}/styles`;

const readFiles = async () => {
  const files = await tool.readdir(pathToCssFiles);
  for (const file of files) {
    const fileExt = file.substring(file.lastIndexOf('.') + 1);
    if (fileExt === 'css') {
      fs.readFile(`${pathToCssFiles}/${file}`, 'utf8', (err, data) => {
        if (err) throw err;
        const arr = data.split('r\\n\\');
        fs.appendFile(bundleFilePath, data + '\n', (err) => {
          if (err) throw err;
        });
      });
    }
  }
}
readFiles();