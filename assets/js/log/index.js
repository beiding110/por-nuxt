var log4js = require("log4js");
var log4js_config = require("./config.json");

log4js.configure(log4js_config);
console.log("log_start start!");

var LogFile = log4js.getLogger('log_file');

module.exports = LogFile
