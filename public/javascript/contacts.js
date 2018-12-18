"use strict";

$(function () {

    var snackbar = document.getElementById("snackbar");
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 8,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 3
            },
            720: {
                items: 3
            },
            1080: {
                items: 5
            }
        }
    })
});

$('.unfriend').click(function () {
    $.ajax({
        url: '/deletecontact',
        type: 'POST',
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "myid": $('#hidden-my-id').text().toString(),
            "fid": $(this).attr('id').toString(),
            "room_id": $(this).children("span").text().toString()
        }),
        success: function (data) {
            console.log(data);
            snackbarMessage(data.toString());
        }
    });
    location.reload();
});

//---------------------------------------------------------
// Snackbar -------------------------------------------
//---------------------------------------------------------


// Toast a snackbar message
// @param message is the message to be shown
function snackbarMessage(message) {
    snackbar.innerHTML = message;
    snackbar.className = "show";
    setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
    }, 2500);
}
