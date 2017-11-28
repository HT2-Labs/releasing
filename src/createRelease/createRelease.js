const fetch = require('node-fetch');
const getChangeLog = require('./getChangeLog');
const getGithubRepo = require('./getGithubRepo');

const createRelease = async ({ githubToken }) => {
  const { version, notes } = await getChangeLog();
  const { owner, repo } = await getGithubRepo();
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `token ${githubToken}`,
    },
    body: JSON.stringify({
      tag_name: version,
      name: version,
      body: notes,
      draft: false,
      prerelease: false,
    }),
  });
  if (res.status === 422) {
    console.log('Release already exists');
  }
  if (res.status === 201) {
    console.log('Release created');
  }
  throw new Error('Unexpected response from Github');
};

module.exports = createRelease;
