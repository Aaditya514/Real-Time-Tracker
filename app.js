//importing express
const { log } = require("console");
const express = require ("express");
const app = express();
//for http server
const http = require("http");
const path = require("path");
const server = http.createServer(app);
//for socket io
const socketio = require("socket.io");
const io = socketio(server);

io.on("connection",(socket)=>{
    socket.on("send-location",(coords)=>{
        //broadcasting the location to all other clients except the sender
        io.emit("receive-location",{id:socket.id,...coords})
    });
    socket.on("disconnect",()=>{
        io.emit("user-disconnected",socket.id);
    });
})

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.get('/',(req,res)=>{
    res.render("index");
})

server.listen(3000);