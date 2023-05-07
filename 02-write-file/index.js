const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath);

stdout.write('Hello! Write text...\n> ');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  writeStream.write(data);
  stdout.write('> ');
});

process.on('SIGINT', () => {
  stdout.write('\n');
  process.exit();
});

process.on('exit', () => stdout.write('Goodbye! Have a nice day!'));


