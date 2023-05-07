const path = require('path');
const fs = require('fs/promises');
const {createReadStream, createWriteStream} = require('fs');
const {stderr} = require('node:process');

const stylesDir = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

const output = createWriteStream(bundle);

(async function () {
  try {

    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      const pathFile = path.join(stylesDir, file.name);
      const input = createReadStream(pathFile, 'utf-8');

      if (file.isFile() && path.extname(pathFile) === '.css') {
        input.on('data', chunk => output.write(chunk));
      }
    }

  } catch (error) {
    stderr.write(error);
  }
})();
