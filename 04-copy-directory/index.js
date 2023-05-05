const fs = require('fs/promises');
const path = require('path');
const { stderr } = require('node:process');

(async function copyDir() {
  try {
    const src = path.join(__dirname, 'files');
    const dest = path.join(__dirname, 'files-copy');

    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });

    const filesSrc = await fs.readdir(src, { withFileTypes: true });

    for (const file of filesSrc) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isFile()) {
        fs.copyFile(srcPath, destPath);
      } else {
        copyDir(srcPath, destPath);
      }

    }

    console.log('ГОТОВО!');

  } catch (error) {
    stderr.write(error);
  }
})();

