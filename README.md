mPubsub
=======

Built pubsub servers and clients using pure node.js 

## Install
```bash
$ npm install mpubsub
```
##Usage

### Setup

```javascript
var mPubsub=require('mpubsub');   
```

### Server side
First you should start the pub-sub server
```javascript
mPubsub.createServer('127.0.0.1',4455);   //create a server at ip:127.0.0.1 and port:4455
```

### Client side
Once you start the server , you can connect to the serve and share the pub-sub

```javascript
//connect to the server (IP:127.0.0.1,port:4455);
mPubsub.connect('127.0.0.1', 4455, function(socket) {

	//SUB
	//sub a channel
	//scoket.sub(channel,callback)
    socket.sub('abc1', function(data) {
    	//when somebody publish something in channel 'abc',the following will work
        console.log('sub data', data);
    });

    //UNSUB
    //unsub a channel
    //socket.unsub('channel');
    socket.unsub('abc2');

    //PUBLISH
    //pub something to channel abc
	//scoket.pub(channel,data)
    socket.pub('abc', '123asd');

    //END
    socket.end();

});
``` 


