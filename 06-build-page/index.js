const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

// Create the distribution directory if it doesn't exist
fs.mkdir(distDir, { recursive: true }, (err) => {
  if (err) {
    throw new Error('Failed to create dist directory');
  }
});

// Copy and modify the template.html file to the dist directory
const componentsDir = path.join(__dirname, 'components');

fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, data) => {
  if (err) {
    throw new Error('Failed to read template file');
  }

  let template = data;

  fs.readdir(componentsDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw new Error('Failed to read components directory');
    }

    files.forEach((file) => {
      const filePath = path.join(componentsDir, file.name);
      const componentName = path.basename(filePath, path.extname(filePath));
      const pattern = new RegExp(`{{\\s*${componentName}\\s*}}`, 'g');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          throw new Error(`Failed to read component file: ${file.name}`);
        }

        template = template.replace(pattern, data);

        if (file === files[files.length - 1]) {
          fs.writeFile(path.join(distDir, 'index.html'), template, (err) => {
            if (err) {
              throw new Error('Failed to write modified template file');
            }
          });
        }
      });
    });
  });
});

// Copy all CSS files from the styles directory to the dist directory
const cssFiles = fs.readdirSync(stylesDir).filter((file) => {
  return path.extname(file) === '.css';
});

if (cssFiles.length) {
  let styles = '';
  cssFiles.forEach((file) => {
    const filePath = path.join(stylesDir, file);
    styles += fs.readFileSync(filePath, 'utf8') + '\n';
  });

  fs.writeFile(path.join(distDir, 'style.css'), styles, (err) => {
    if (err) {
      throw new Error('Failed to write styles file');
    }
  });
}

// Copy the entire assets directory to the dist directory
fs.mkdir(path.join(distDir, 'assets'), { recursive: true }, (err) => {
  if (err) {
    throw new Error('Failed to create assets directory');
  }

  const copyAsset = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach((file) => {
        copyAsset(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };

  copyAsset(assetsDir, path.join(distDir, 'assets'));
});
