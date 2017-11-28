const git = require('simple-git')('.');

const getLog = (opts) => {
  return new Promise((resolve, reject) => {
    git.log(opts, (err, { all }) => {
      if (err) return reject(err);
      return resolve(all);
    });
  });
};

module.exports = getLog;