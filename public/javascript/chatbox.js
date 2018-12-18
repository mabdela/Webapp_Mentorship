$('.chat-body').hide();



// global variables
var i = 0;
var my_id = null;
var my_pic = null;
var names = [];
var pics = [];
var ids = [];
var room_ids = [];
var socket;
var showcount = 1;

// initial setup
$.get('/chatuser', function (data) {
    var user = data;
    my_id = user._id;
    my_pic = user.profilePicture;
    var contacts = user.contacts;
    for (var idx in contacts) {
        if (contacts.hasOwnProperty(idx)) {
            names.push(contacts[idx].name);
            pics.push(contacts[idx].pic);
            ids.push(contacts[idx].id);
            room_ids.push(contacts[idx].room_id);
        }
    }
});

// socket variables

var id = null; //room id, default

//---------------------------------------------------------
// Snackbar -------------------------------------------
//---------------------------------------------------------
var snackbar = document.getElementById("snackbar");

// Toast a snackbar message
// @param message is the message to be shown
function showMessage(message) {
    snackbar.innerHTML = message;
    snackbar.className = "show";
    setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
    }, 2500);
}


//---------------------------------------------------------
//functions def
//---------------------------------------------------------
function scrollToButtom() {
    $('.chat-box').scrollTop($('.chat-box').get(0).scrollHeight);
}

function createRihgtBubble(msgText, moment) {
    var bubble = $(
        '<div class="chat-bubble right">' +
        '<div class="pull-right">' +
        '<img src= ' + my_pic + ' alt="" class="icon-avatar">' +
        '</div>' +
        '<div class="message-body">' +
        '<div class="message-content pull-right">' + msgText + '</div>' +
        '</div>' +
        '</div>'
    );

    $('.chat-box').append(bubble);
}

function createLeftBubble(msgText) {
    var bubble = $(
        '<div class="chat-bubble left">' +
        '<div class="pull-left">' +
        '<img src= ' + pics[i] + ' alt="" class="icon-avatar">' +
        '</div>' +
        '<div class="message-body">' +
        '<div class="message-content pull-left">' + msgText + '</div>' +
        '</div>' +
        '</div>'
    );

    $('.chat-box').append(bubble);
}

function sendMessage() {
    var msgText = $('#message-input').val().trim();
    if (msgText.length) {
        // Creat my chat bubble
        createRihgtBubble(msgText);
        scrollToButtom();

        // Send the message to the other person in the chat
        socket.emit('msg', {
            msg: msgText,
            id: room_ids[i]
        });

        // Insert into db

        $.ajax({
            url: "/chat?room=" + room_ids[i],
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "sender_id": my_id,
                "text": msgText,
                "file": "null",
                "time": "null"
            }),
            success: function () {
                console.log("add chat to log");
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });

    }

    // Clear input field
    $('#message-input').val("");
    showMessage("your msg is sent");
}


//---------------------------------------------------------
//------- scoket part ------------------------------------
//---------------------------------------------------------
//var socket = io();

function createChat(id) {
    console.log('createChat');
    socket.on('connect', function () {
        showMessage("connect");
        console.log('connect');
        socket.emit('load', id); // room_id
        console.log('load emitted');
    });


    socket.on('peopleinchat', function (data) {
        console.log('peopleinchat');
        if (data.number === 0) {
            // and a notice : that person is offline, leave a message"
            $('#status').text("Offline");
            showMessage("friend not connected");

        } else if (data.number === 1) {
            // and a notice : that person online. Start chatting"
            $('#status').text("Online");
            showMessage("friend connected");
        }
    });

    socket.on('leave', function (data) {
        if (data.boolean && id == data.room) {
            $('#status').text("Offline");
            showMessage("friend left chat");
        }
    });

    socket.on('receive', function (data) {
        $('#status').text("Online");
        showMessage("receive a message");
        if (data.msg.trim().length) {
            // Create friend chat bubble
            console.log("recv msg");
            createLeftBubble(data.msg);
            scrollToButtom();
        }
    });

    socket.on('startChat', function (data) {
        if (data.boolean && data.id == id) {
            showMessage("chat starts");
            $('#status').text("Online");
        }
    });
}

$("#message-input").keypress(function (e) {
    // send message on enter
    if (e.which == 13) {
        e.preventDefault();
        sendMessage();
    }
});

$("#send-message-button").click(function () {
    sendMessage();
});


function getChatLog(room_id, i) {
    var mdata;
    $.get('/chatlog?room=' + room_id, function (data) {
        var chatlog = data;
        for (var i in chatlog) {
            if (chatlog[i].sender_id == my_id) {
                createRihgtBubble(chatlog[i].text);
            } else {
                createLeftBubble(chatlog[i].text);
            }
        }
        scrollToButtom();
    });
}


// clicking on a contact, go to a new chatroom
$('.friend-list-item').on('click', function (e) {
    //e.preventDefault();
    e.stopPropagation();
    //location.reload();
    i = $(this).attr("id");
    $('.chat-box').empty();
    $('.chat-body').show();
    $('.chat-box').show();
    if (socket) {
        unregisterListener();
        socket.io.disconnect();
        socket.io.reconnect('http://localhost:3000');

        createChat(room_ids[i]);
    } else {
        socket = io().connect('http://localhost:3000');
        createChat(room_ids[i]);
    }

    //socket.emit('load', room_ids[i]); // room_id

    getChatLog(room_ids[i], i);
    $('#friend-pic').attr("src", pics[i]);
    $('#chat-name').text(names[i]);
    //$(this).off('click');
});


function unregisterListener() {
    socket.removeListener('connect');
    socket.removeListener('peopleinchat');
    socket.removeListener('leave');
    socket.removeListener('receive');
    socket.removeListener('startChat');
}

$('#contact').click(function () {
    if (showcount == 1) {
        $('.chat-menu').hide();
        showcount = 0;
    } else {
        $('.chat-menu').show();
        showcount = 1;
    }
});
