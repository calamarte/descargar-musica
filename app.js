let http = require('http');
const io = require('socket.io');
const app = require('express')();
const converter = require('./you-dowload-mp3');

app.use(require('body-parser').json());

const server = http.createServer(app);

app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/index.html');
});

server.listen(3000, function(){
    console.log('encendido tt');
});

const sockets = io.listen(server);
let actualSocket;

app.post('/convert', (req, res)=>{
    if(req.body.videos)converter(req.body.videos, (message)=>{
        if(actualSocket)actualSocket.emit('info', message);
    });
});

sockets.on('connection', (socket)=>{
    actualSocket = socket;
});
