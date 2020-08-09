// import handlebars/runtime
const Handlebars = require('handlebars/runtime');

// import handlebars-helpers
const handlebarsHelpers = require('handlebars-helpers');

// register handlebars-helpers
Handlebars.registerHelper(handlebarsHelpers());

// handlebars/runtime with custom helpers.
// used by handlebars-loader.
module.exports = Handlebars;