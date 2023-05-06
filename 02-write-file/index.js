const fs = require('fs');
const path = require('path');

const { stdin, stdout } = require('process');
const absPath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(absPath, { flags: 'a' });

stdout.write('Hey! Please write here:  \n');

stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'exit') {
    farewell();
  } else {
    output.write(input + '\n');
  }
});

process.on('SIGINT', farewell);

function farewell() {
  stdout.write('\nSee you later! \n');
  process.exit();
}
