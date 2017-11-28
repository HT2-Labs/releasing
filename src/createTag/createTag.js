const git = require('simple-git')(__dirname);
const semver = require('semver');
const getTags = require('../utils/getTags');
const getLog = require('../utils/getLog');

const levels = ['none', 'patch', 'minor', 'major'];

const getLevelFromMessage = (message) => {
  if (/BREAKING CHANGE/.test(message)) return 3;
  if (/^(feat|perf)/.test(message)) return 2;
  if (/^fix/.test(message)) return 1;
  return 0;
};

const pushTag = (tag) => {
  return new Promise((resolve, reject) => {
    git.addTag(`v${nextRelease}`).pushTags((err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

const createTag = async () => {
  const { latest } = await getTags();
  const logLines = await getLog({ from: latest, to: 'HEAD' });
  const messages = logLines.map(({ message }) => message);
  const level = messages.reduce((result, message) => {
    const messageLevel = getLevelFromMessage(message);
    return Math.max(result, messageLevel);
  }, 0);
  if (level > 0) {
    const nextRelease = semver.inc(latest, levels[level]);
    await pushTag(`v${nextRelease}`);
    console.log(`Released v${nextRelease}`);
  } else {
    console.log('No release');
  }
};

module.exports = createTag;
