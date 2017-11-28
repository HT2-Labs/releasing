const createRelease = require('./createRelease');

const githubToken = process.env.GH_TOKEN;

createRelease({ githubToken }).then(() => {
  console.log('Created a new release');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});