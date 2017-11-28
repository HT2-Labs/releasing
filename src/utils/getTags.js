const git = require('simple-git')('.');

const getTags = () => {
  return new Promise((resolve, reject) => {
    git.pull().tags((err, { latest, all }) => {
      if (err) return reject(err);
      return resolve({ latest, all });
    });
  });
};

module.exports = getTags;