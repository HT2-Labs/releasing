const git = require('simple-git/promise')('.');
const { first } = require('lodash');

const getGithubRepo = async () => {
  const remotes = await git.getRemotes(true);
  const remote = first(remotes).refs.fetch;
  const regex = /([\w\-]+)\/([\w\-]+)\.git/;
  const parts = regex.exec(remote);
  const owner = parts[1];
  const repo = parts[2];
  return { owner, repo };
};

module.exports = getGithubRepo;