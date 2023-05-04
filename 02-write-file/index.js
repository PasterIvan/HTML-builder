const path = require('path');
const {stdout, stdin, exit} = require('process');
const {createWriteStream} = require('fs');

const file = path.join(__dirname, '', 'text.txt');

const writeStream = createWriteStream(file);

stdout.write('Привет! Я создал файл в котором ты можешь ввести текст. \nВведи текст: ');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  writeStream.write(data);
}
);

process.on('exit', () => {
  stdout.write('Успехов в учёбе!');
});

process.on('SIGINT', exit);
