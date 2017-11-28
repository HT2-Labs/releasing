const git = require('simple-git')('.');
const { first } = require('lodash');

const getGithubRepo = async () => {
  return new Promise((resolve, reject) => {
    git.getRemotes(true, (err, remotes) => {
      if (err) return reject(err);
      const remote = first(remotes).refs.fetch;
      const regex = /([\w\-]+)\/([\w\-]+)\.git/;
      const parts = regex.exec(remote);
      const owner = parts[1];
      const repo = parts[2];
      return resolve({ owner, repo });
    });
  });
};

module.exports = getGithubRepo;