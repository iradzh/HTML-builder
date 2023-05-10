const fs = require('fs').promises;
const path = require('path');
const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyDir(srcPath, destPath) {
  try {
    await fs.rm(destPath, { recursive: true });
  } catch (error) {
    // ignore
  }

  await fs.mkdir(destPath);

  const files = await fs.readdir(srcPath);
  for (const file of files) {
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);
    const stats = await fs.stat(srcFile);
    if (stats.isDirectory()) {
      await copyDir(srcFile, destFile);
    } else {
      await fs.copyFile(srcFile, destFile);
    }
  }
}

copyDir(srcPath, destPath);
