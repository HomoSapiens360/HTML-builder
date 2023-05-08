const fs = require('fs');
const path = require('node:path');
const fullPath = path.join(__dirname);
const stream = fs.createReadStream(fullPath + '/text.txt', { encoding: 'utf-8' });

stream.on('readable', () => {
  let data;
  while ((data = stream.read()) !== null) {
    console.log(data);
  }
});
