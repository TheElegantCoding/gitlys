import { getConfiguration } from '@src/util/file_configuration.js';
import fs from 'node:fs';
import path from 'node:path';

const updatePackageJson = (newVersion: string) => {
  const packagePath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packagePath)) {
    return;
  }

  let content = fs.readFileSync(packagePath, 'utf8');
  const versionRegex = /("version"\s*:\s*")[^"]*(")/;

  if (versionRegex.test(content)) {
    content = content.replace(versionRegex, `$1${newVersion}$2`);
    fs.writeFileSync(packagePath, content, 'utf8');
  }
};

const updatePackageBuild = (newVersion: string) => {
  const buildPath = path.join(process.cwd(), 'PKGBUILD');

  if (!fs.existsSync(buildPath)) {
    return;
  }

  let content = fs.readFileSync(buildPath, 'utf8');
  const versionRegex = /(pkgver\s*=\s*)(["']?)[^\s"']+\2/;

  if (versionRegex.test(content)) {
    content = content.replace(versionRegex, `$1$2${newVersion}$2`);
    fs.writeFileSync(buildPath, content, 'utf8');
  }
};

const updateFiles = (newVersion: string) => {
  const config = getConfiguration();

  config.release.files?.forEach((element) => {
    if (element === 'package.json') {
      updatePackageJson(newVersion);
    } else if (element === 'PKGBUILD') {
      updatePackageBuild(newVersion);
    }
  });

  updatePackageJson(newVersion);
  updatePackageBuild(newVersion);
};

export { updateFiles, updatePackageJson, updatePackageBuild };