const {readdir} = require('fs/promises');
const fs = require('fs/promises');

const path = require('path');
const {stdout} = require('process');

const dir = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await readdir(dir, {
      encoding: 'utf8',
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const pathFile = path.join(dir, file.name);
        const name = file.name.split('.')[0];
        const extension = file.name.split('.')[1];
        let size = '';
        fs.stat(pathFile).then((res) => {
          size += res.size;
          stdout.write(`${name} - ${extension} - ${size}\n`);
        });
      }
    }

  } catch (err) {
    console.error(err);
  }
})();
