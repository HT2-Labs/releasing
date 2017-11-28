const git = require('simple-git')('.');

const getTags = async () => {
  return await git.pull().tags();
};

module.exports = getTags;