var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatroomSchema = new Schema({
    speaker1_id: {
        type: String,
        required: true
    },
    speaker2_id: {
        type: String,
        requried: true
    },
    room_id: {
        type: String,
        requried: true
    },
    chatlog: [
        {
            sender_id: {
                type: String,
                required: true
            },
            text: {
                type: String
            },
            file: {
                type: String
            },
            time: {
                type: String
            }
        }
    ]
}, {
    collection: 'chatrooms'
});

//mongoose.connect('mongodb://localhost/MentorRock');
module.exports = mongoose.model('Chatroom', chatroomSchema);


// var Room = mongoose.model('Chatroom', chatroomSchema);
// var d = new Room({
//     "speaker1_id": "583b340c1e0d8c1470b4d757",
//     "speaker2_id": "583b344f1e0d8c1470b4d758",
//     "room_id": "1111",
//     "chatlog": [
//         {
//             "sender_id": "583b344f1e0d8c1470b4d758",
//             "text": "Hello",
//             "file": "null",
//             "time": "5"
//             },
//         {
//             "sender_id": "583b340c1e0d8c1470b4d757",
//             "text": "I have some problem with the experiment procedure. Could you please explain a little bit on the initial set-up. What is the importance of the callibration at the beginning, and what would be affected if we skip the tedious steps? Further, isn't it likely that we need to callibrate each time we do another round of observation given the criteria, it doesn't seem practical.",
//             "file": "null",
//             "time": "583b344f1e0d8c1470b4d758"
//             },
//         {
//             "sender_id": "583b344f1e0d8c1470b4d758",
//             "text": "Yeah that's a good question!! I remember having similar confusiton while I first read that part. Well, in fact, I think it would be easier if you try to go through the whole procedure in your mind, and consider taking out one step, and compare what might go wrong. Maybe you can now describe the procedure to me, and let's discuss what really is a must and what is not, and why.",
//             "file": "null",
//             "time": "3"
//             },
//         {
//             "sender_id": "583b340c1e0d8c1470b4d757",
//             "text": "Oh that would be awesome, so from what I read, we should first .... and then ... so .... but.... XD Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, tenetur?",
//             "file": "null",
//             "time": "4"
//             }
//         ]
// });
// d.save(function (err) {
//     if (err) {
//         console.log(err);
//     }
// });

//var dd = new Room({
//    "speaker1_id": "583b340c1e0d8c1470b4d757",
//    "speaker2_id": "583b93a14fd67530d61168eb",
//    "room_id": "1112",
//    "chatlog": []
//});
//dd.save(function (err) {
//    if (err) {
//        console.log(err);
//    }
//});
