const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  const stylesPath = path.join(__dirname, 'styles');
  const destPath = path.join(__dirname, 'project-dist', 'bundle.css');

  const files = await fs.readdir(stylesPath);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const styles = await Promise.all(
    cssFiles.map(async (file) => {
      const filePath = path.join(stylesPath, file);
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    })
  );

  await fs.writeFile(destPath, styles.join('\n'));
  console.log('Merged styles into bundle.css');
}

mergeStyles();
