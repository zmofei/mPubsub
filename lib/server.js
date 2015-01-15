var net = require('net');

var channelCatch = {};

exports.createServer = function(ip, port) {
    if (!port || !ip) throw new Error('createServer --> port, ip is necessary');

    net.createServer(function(sock) {
        var address, port;

        sock.on('data', function(data) {
            address = sock.remoteAddress;
            port = sock.remotePort;

            var dataStr = data.toString();
            var orders = dataStr.match(/(\{.+?\})(?={|$)/g);

            if (orders) orders.forEach(function(data) {
                var obj = JSON.parse(data);
                var name = address + '_' + port;
                var channel = obj.channel;

                console.log(obj, name, channel);

                if (obj.type == 'sub') {
                    channelCatch[channel] = channelCatch[channel] || {};
                    channelCatch[channel][name] = channelCatch[channel][name] || {};
                    channelCatch[channel][name].socket = sock;
                } else if (obj.type == 'pub') {
                    var pubData = obj.data;
                    var channels = channelCatch[channel];

                    for (var i in channels) {
                        var Json = {
                            'channel': channel,
                            'data': pubData
                        };
                        channels[i].socket.write(JSON.stringify(Json));
                    }
                } else if (obj.type == 'unsub') {
                    delete channelCatch[channel][name];
                }
            });


        });

        sock.on('close', function(data) {
            //remove the channel 
            var name = address + '_' + port;
            for (var i in channelCatch) {
                if (channelCatch[i][name]) delete channelCatch[i][name];
            }
        });
        sock.on('error', function(err) {
            console.log(err);
        });
    }).listen(port, ip, function() {
        console.log('server start at ' + ip + ':' + port);
    });

};
