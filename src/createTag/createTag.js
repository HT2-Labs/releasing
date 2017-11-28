const git = require('simple-git/promise')(__dirname);
const semver = require('semver');
const getTags = require('../utils/getTags');
const getLog = require('../utils/getLog');
const getGithubRepo = require('../utils/getGithubRepo');

const levels = ['none', 'patch', 'minor', 'major'];

const getLevelFromMessage = (message) => {
  if (/BREAKING CHANGE/.test(message)) return 3;
  if (/^(feat|perf)/.test(message)) return 2;
  if (/^fix/.test(message)) return 1;
  return 0;
};

const pushTag = async ({ tag }) => {
  await git.addTag(tag);
  await git.pushTags();
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
    const nextRelease = latest === undefined ? '1.0.0' : semver.inc(latest, levels[level]);
    const tag = `v${nextRelease}`;
    await pushTag({ tag });
    console.log(`Created tag ${tag}`);
  } else {
    console.log('No tag');
  }
};

module.exports = createTag;
