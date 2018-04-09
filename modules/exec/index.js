const {spawn} = require('child_process');

module.exports = (command, ...args) => new Promise((resolve, reject) => {
  const child = spawn(command, [...args], {stdio: [0, 1, 2, 'ipc', 'pipe']});
  child.on('exit', resolve);
});
