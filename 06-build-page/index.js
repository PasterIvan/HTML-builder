const path = require('path');
const {readdir, mkdir, rm, writeFile, copyFile, stat} = require('fs/promises');
const {createWriteStream, createReadStream} = require('fs');

const dist = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');

(async function () {
  await mkdir(dist, {recursive: true});
})();

const index = path.join(dist, 'index.html');
const style = path.join(dist, 'style.css');

const indexStream = createReadStream(template);
const styleStream = createWriteStream(style);

(async function () {
  let html = '';

  indexStream.on('data', chunk => html += chunk);

  const files = await readdir(components, {withFileTypes: true});

  for (const file of files) {
    const nameComponent = `{{${file.name.split('.')[0]}}}`;
    const pathFile = path.join(components, file.name);
    const data = await stat(pathFile);

    if (data.isFile() && path.extname(pathFile) === '.html') {
      const stream = createReadStream(pathFile, 'utf-8');
      stream.on('data', chunk => {
        html = html.replace(nameComponent, chunk.toString());
      });
      stream.on('end', () => writeFile(index, html));
    }
  }

})();

(async function () {
  const files = await readdir(styles, {withFileTypes: true});

  for (const file of files) {
    const pathFile = path.join(styles, file.name);
    const input = createReadStream(pathFile, 'utf-8');
    const data = await stat(pathFile);

    if (data.isFile() && path.extname(pathFile) === '.css') {
      input.on('data', chunk => styleStream.write(chunk));
    }
  }

})();

(async function copyDir(dir, copiedItems) {
  await rm(dir, {recursive: true, force: true});
  await mkdir(dir, {recursive: true});

  const files = await readdir(copiedItems, {withFileTypes: true});

  for (const file of files) {

    if (file.isFile()) {
      const pathFile = path.join(copiedItems, file.name);
      const fileCopyPath = path.join(dir, file.name);
      await copyFile(pathFile, fileCopyPath);
    } else {
      await copyDir(path.join(dir, file.name), path.join(copiedItems, file.name));
    }

  }

})(path.join(dist, 'assets'), assets);
