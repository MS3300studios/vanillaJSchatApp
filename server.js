import express from "express";
import { Server } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const PORT = 3000;
const app = express();
const options = {
    cors: true,
    origin: ['http://localhost:3000']
};

app.use(express.static('./dist'));

const server = app.listen(PORT, function () {
    console.log('server started');
});

const io = new Server(server, options);

app.get('/', function (req, res) {
    res.sendFile("index.html");
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile("favicon.ico");
});

const users = [];

io.on("connection", socket => {
    const userId = uuidV4();
    users.push({sid: socket.id, uid: userId})
    socket.emit("returnId", { sid: socket.id, uid: userId });

    socket.join("room1");

    socket.on("showUsers", () => {
        console.log(users)
    });

    socket.on('disconnect', function() {
        users.forEach((user, index) => {
            if(user.uid === userId) users.splice(index, 1);
        });
    });

    socket.on("sendMessage", message => {
        io.to("room1").emit("dispatchMessage", { uid: userId, msg: { date: new Date(), messageText: message } });
    });
});