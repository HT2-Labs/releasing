const git = require('simple-git/promise')('.');

const getTags = async () => {
  await git.pull();
  return git.tags();
};

module.exports = getTags;