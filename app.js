const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection
io.on('connection', function (socket) {
      socket.on("sendLocation", function (data) {
        io.emit("receiveLocation", {id: socket.id, ...data});
});
    socket.on('disconnect', function () {
        io.emit('A user disconnected', socket.id);
    });
});

// Route to render the index.ejs view
app.get('/', function (req, res) {
    res.render('index');
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
