const opn = require('opn');

module.exports = (link) => new Promise((resolve, reject) => {
  opn(link).then(resolve);
});
