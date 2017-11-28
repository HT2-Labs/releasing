const git = require('simple-git/promise')('.');

const getTags = async () => {
  return await git.pull().tags();
};

module.exports = getTags;