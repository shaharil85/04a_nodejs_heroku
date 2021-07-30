let app = require('express')();
let server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        //allowedHeaders: ["my-custom-header"],
        //credentials: true,
        //origin: "http://localhost:8100",
        //methods: ["GET", "POST"]   
    }    
});
  
app.get('/', (req, res) => {
    res.status(200).send('Hello Yeah!!');

});

io.on('connection', (socket) => {
    socket.on('disconnect', function () {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    });
    socket.on('set-name', (name) => {
        socket.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
    });
    socket.on('send-message', (message) => {
        io.emit('message', { msg: message.text, user: socket.username, createdAt: new Date() });
    });
});

var port = process.env.PORT || 3030;
server.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});

