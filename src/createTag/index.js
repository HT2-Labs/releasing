const createTag = require('./createTag');

const user = process.env.GH_USER;
const pass = process.env.GH_PASS;

createTag({ user, pass }).then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});