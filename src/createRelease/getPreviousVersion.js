const { dropWhile, first } = require('lodash');

const versionNumbersRegex = /(\d+)(\.\d+)*/;
const EQ = 0;
const BEFORE = -1;
const AFTER = 1;

const splitSemver = (versionString) => {
  return versionNumbersRegex.exec(versionString)[0].split('.').map((versionNumber) => {
    return parseInt(versionNumber, 0);
  });
};

const compareSemver = (aVersionNumbers, bVersionNumbers) => {
  return aVersionNumbers.reduce((result, aVersionNumber, index) => {
    if (result !== EQ) return result;
    if (aVersionNumber > bVersionNumbers[index]) return BEFORE;
    if (aVersionNumber < bVersionNumbers[index]) return AFTER;
    return EQ;
  }, EQ);
};

const getPreviousVersion = (allVersions, currentVersion) => {
  const splitCurrentVersion = splitSemver(currentVersion);
  const splitVersions = allVersions.map(splitSemver);
  const sortedVersions = splitVersions.sort(compareSemver);
  const previousVersions = dropWhile(sortedVersions, (sortedVersion) => {
    return compareSemver(sortedVersion, splitCurrentVersion) !== AFTER;
  });
  const previousVersion = first(previousVersions);
  const previousVersionString = `v${previousVersion.join('.')}`;
  return previousVersionString;
};

module.exports = getPreviousVersion;