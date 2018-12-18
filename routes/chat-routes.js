//exports.findUserRoom = function (req, res) {
//    var query = require('url').parse(req.url, true).query;
//    var my_id = query.myid;
//    console.log('findRooms of user ' + my_id);
//    Chatroom.find({
//        $or: [{
//            speaker1_id: my_id
//        }, {
//            speaker2_id: my_id
//        }]
//    }, function (err, rooms) {
//        if (err) throw err;
//        res.send(rooms);
//    });
//};



// =============================================================================
// socket io implement =============================================================
// =============================================================================
// Initialize a new socket.io application, named 'chat'
module.exports = function (app, io) {

    var chat = io.on('connection', function (socket) {
        console.log("connection established");

        // When the client emits the 'load' event, reply with the
        // number of people in this chat room

        socket.on('load', function (data) {
            console.log("loading" + data);

            var room = findClientsSocket(io, data);

            if (room.length === 0) {
                console.log("0 ppl in chat");
                socket.emit('peopleinchat', {
                    number: 0
                }); // only you there, leave a message
                socket.join(data);
                console.log("joined " + data);
            } else if (room.length === 1) {
                console.log("1 ppl in chat");
                socket.emit('peopleinchat', {
                    number: 1
                }); // already someone there, chat with him/her

                socket.join(data);
                console.log("joined " + data);
                console.log("chat starts");
                chat.in(data).emit('startChat', {
                    boolean: true,
                    id: data.id
                });
            } else {
                console.log(">= 2 ppl in chat");
            }
        });


        socket.on("force_leave", function () {
            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room: this.room
            });
            socket.leave(socket.room);
        });

        // Somebody left the chat
        socket.on('disconnect', function () {
            console.log("recv disconnect");
            // Notify the other person in the chat room
            // that his partner has left
            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room: this.room
            });
            // leave the room
            socket.leave(socket.room);
        });

        // Handle the sending of messages
        socket.on('msg', function (data) {
            console.log("on message");
            // When the server receives a message, it sends it to the other person in the room.
            socket.in(data.id).emit('receive', {
                msg: data.msg
            });
        });
    });
};

function findClientsSocket(io, roomId, namespace) {
    var res = [],
        ns = io.of(namespace || "/"); // the default namespace is "/"
    //console.log(ns);
    //console.log(ns.connected[id]);
    if (ns) {
        for (var id in ns.connected) {
            if (roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId);
                if (index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;

}
