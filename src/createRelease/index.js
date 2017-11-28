const createRelease = require('./createRelease');

const githubToken = process.env.GH_TOKEN;

createRelease({ githubToken }).then(() => {
  console.log('Created a new release');
});