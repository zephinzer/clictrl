const fs = require('fs');
const path = require('path');

const autocompletePrompt = require('inquirer-autocomplete-prompt');
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const yaml = require('yamljs');

let data = yaml.load(path.join(__dirname, './data.yaml'));
const dataHash = data.reduce((prev, curr) => (Object.assign(prev, {[curr.label]: curr})), {})

inquirer.registerPrompt('autocomplete', autocompletePrompt);

(function beginLoop() {
  inquirer.prompt({
    type: 'autocomplete',
    name: 'activity',
    message: 'What do you want to do today?',
    source: (answers, input) => {
      return (input) ? new Promise((resolve, reject) => {
        const possibleActions = data.map((action) => {
          if (action.tags) {
            return action.label + '|d/e/l/i/m|' + action.tags.toString();
          } else {
            return action.label;
          }
        });
        resolve(fuzzy.filter(input || '', possibleActions).map((e) => ({
          name: e.original.split('|d/e/l/i/m|')[0],
          type: 'question',
          message: 'hi'
        })));
      }) : new Promise((resolve, reject) => resolve([]))
    },
  }).then((answer) => {
    const {action} = dataHash[answer.activity];
    const moduleInstance = require(`./modules/${action.module}`);
    moduleInstance.apply(null, [...action.args])
      .then(() => {
        setTimeout(beginLoop, 500);
      })
  })
})();
