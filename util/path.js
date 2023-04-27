//creating a utility function that gives the path of the main module which we can call/import whevenever we need it
const path = require('path');

module.exports = path.dirname(require.main.filename);