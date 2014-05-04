var client = require('./lib/client');
var server = require('./lib/server');

exports.createServer = server.createServer;
exports.connect = client.connect;


