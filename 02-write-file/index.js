const process = require('node:process');
const readline = require('node:readline');
const path = require('node:path');
const fs = require('fs');
const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });
const fullPath = path.join(__dirname) + '/file.txt';

fs.open(fullPath, 'wx', (err) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.clear();
      console.error('file.txt is already exists');
      return;
    }
    throw err;
  }
});
console.log('Enter your text here: ');
rl.on('line', (data) => {
  if (data === 'exit') {
    rl.close();
    return;
  }

  fs.appendFile(fullPath, data + '\n', (err) => {
    if (err) throw err;
  });
});

process.on('beforeExit', () => {
  console.log(
    'Thank you for using this program',
  );
});

