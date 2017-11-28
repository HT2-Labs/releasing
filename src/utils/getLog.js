const git = require('simple-git/promise')('.');

const getLog = async (opts) => {
  const { all } = await git.log(opts);
  return all;
};

module.exports = getLog;