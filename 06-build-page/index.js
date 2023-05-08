const tool = require('node:fs/promises');
const path = require('path');
const fs = require('fs');
const { mkdir, readdir } = require('node:fs');
const rootPath = path.join(__dirname);
const distFolderName = `${rootPath}/project-dist`;
const newDirName = `${distFolderName}/assets`;
const originalDirName = `${rootPath}/assets`;
const fsPromises = require('node:fs/promises');

fs.mkdir(newDirName, { recursive: true }, (err) => {
  if (err) throw err;
});

function copyAssetsFolder(target, source) {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const copyFiles = async () => {
    const files = await tool.readdir(source);
    for (const file of files) {
      fs.stat(source + '/' + file, (err, item) => {
        const dirArr = [];
        if (err) throw err;
        if (item.isDirectory()) {
          copyAssetsFolder(target + '/' + file, source + '/' + file);
        } else {
          fs.copyFile(`${source}/${file}`, `${target}/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  }
  copyFiles();
}

function removeAssetFolder(path) {

  fs.rm(path, { recursive: true, force: true }, err => {
    if (err) throw err;
    copyAssetsFolder(newDirName, originalDirName);
  });
}


function bundleCssFiles(path) {
  const bundleFilePath = `${path}/style.css`;
  const pathToCssFiles = `${rootPath}/styles`;


  fs.access('myfile', (err) => {
    if (!err) {
      console.error('myfile уже существует');
      return;
    }
    fs.writeFile(bundleFilePath, '', err => {
      if (err) throw err;
    });
  });

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
}

function createHtmlFile(targetFilePath, sourceFilePath, componentFilesPath) {

  function eraseAllInner(filePath) {
    fs.access('myfile', (err) => {
      if (!err) {
        console.error('myfile уже существует');
        return;
      }
      fs.writeFile(filePath, '', err => {
        if (err) throw err;
      });
    });
  }

  function copyHtmlWithReplacingTemlateTags(target, source, components) {

    async function getHtmlfromSourceFile(path) {
      try {
        const contents = await fsPromises.readFile(path, { encoding: 'utf8' });
        return contents;
      } catch (err) {
        console.error(err.message);
      }
    }

    const componentFilesContent = async (componentPath) => {
      try {
        const componentContent = await fsPromises.readFile(componentPath, { encoding: 'utf8' });
        return new Array(componentContent);
      } catch (err) {
        console.error(err.message);
      }
    }

    getHtmlfromSourceFile(`${source}/template.html`).then(content => {
      const re = /\{\{\w+\}\}/gi;
      const matchesResultArr = content.match(re);
      let arr1 = [];
      const componentsNamesArr = matchesResultArr.map(result => result.substring(2, result.length - 2));
      for (const componentName of componentsNamesArr) {
        arr1.push((componentFilesContent(`${components}/${componentName}.html`)));
      }
      Promise.all(arr1).then(
        value => {
          let oldContent = content;
          for (let i = 0; i < matchesResultArr.length; i++) {
            oldContent = oldContent.replace(matchesResultArr[i], value[i]);
          }
          fs.writeFile(target, oldContent, err => {
            if (err) throw err;
          });
        }
      );

    });
  }
  eraseAllInner(targetFilePath);
  copyHtmlWithReplacingTemlateTags(targetFilePath, sourceFilePath, componentFilesPath);
}

removeAssetFolder(newDirName);
bundleCssFiles(distFolderName);
createHtmlFile(`${distFolderName}/index.html`, rootPath, `${rootPath}/components`);