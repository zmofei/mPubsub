var net = require('net');

//

function Pubsub(socket) {
    this.socket = socket;
    this.channelCallback = {};
}
Pubsub.prototype = {
    'pub': function(channel, data) {
        if (!channel || !data) throw new Error('method pub --> channel and data is necessary');
        var Json = {
            'type': 'pub',
            'channel': channel,
            'data': data
        };
        this.socket.write(JSON.stringify(Json));
        return this;
    },
    'sub': function(channel, callback) {
        if (!channel || !callback) throw new Error('method sub --> channel and callback is necessary');
        var Json = {
            'type': 'sub',
            'channel': channel
        };
        var writeDate = this.socket.write(JSON.stringify(Json));
        if (writeDate) this.channelCallback[channel] = callback;
        return this;
    },
    'unsub': function(channel) {
        if (!channel) throw new Error('method unsub --> channel is necessary');
        var Json = {
            'type': 'unsub',
            'channel': channel
        };
        var writeDate = this.socket.write(JSON.stringify(Json));
        delete this.channelCallback[channel];
        return this;
    },
    'end': function() {
        this.socket.end();
        return this;
    },
    'constructor': Pubsub
};
//

exports.connect = function(ip, port, callback) {
    var client = new net.Socket();
    var pubsubClient = new Pubsub(client);

    client.connect({
        host: ip,
        port: port
    });

    client.on('connect', function() {
        if (callback) callback(pubsubClient);
    });

    client.on('error', function(err) {
        setTimeout(function(){
            client.connect({
                host: ip,
                port: port
            });
        },1000);
        console.log('connect error', err);
    });

    client.on('data', function(data) {
        var dataStr = data.toString();
        var orders = dataStr.match(/(\{.+?\})(?={|$)/g);

        if (orders) orders.forEach(function(data) {

            var dataJson = JSON.parse(data);
            console.log(dataJson);
            var channel = dataJson.channel;
            var callback = pubsubClient.channelCallback[channel];

            if (callback) callback(dataJson.data);

        });
    });

    client.on('end', function() {});
};
