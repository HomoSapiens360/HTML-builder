const tool = require('node:fs/promises');
const path = require('path');
const fs = require('fs');
const fullPath = path.join(__dirname);
const newDirName = `${fullPath}/files-copy`;
const originalDirName = `${fullPath}/files`;

fs.mkdir(newDirName, { recursive: true }, (err) => {
  if (err) throw err;
});

const removeFiles = async () => {
  fs.stat(newDirName, (err) => {
    if (err) {
      throw err;
      return
    }
  });
  const files = await tool.readdir(newDirName);
  for (const file of files) {
    fs.unlink(`${newDirName}/${file}`, (err) => {
      if (err) throw err;
    });
  }
}

const copyFiles = async () => {
  const files = await tool.readdir(originalDirName);
  for (const file of files) {
    fs.copyFile(`${originalDirName}/${file}`, `${newDirName}/${file}`, (err) => {
      if (err) throw err;
    });
  }
}
removeFiles();
copyFiles();
