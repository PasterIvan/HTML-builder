const {createReadStream} = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const stream = createReadStream(file, 'utf-8');

let data = '';

stream.on('data', (chunk, error) => {
  if (error) throw error;
  data += chunk;
});
stream.on('end', () => console.log(data));
