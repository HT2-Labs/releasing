const createTag = require('./createTag');

createTag().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});