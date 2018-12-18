$(function () {
    //Ajax request to find users data
    $("#manageUsers").addClass("active");
    var usersView=function () {
        $(".users").show();
        $(".users").siblings("div").hide();
        //Ajax GET request to get users data
        var users;
        $.ajax({
            url:'/users',
            Type:'GET',
            dataType:'json',
            success:function (data) {
                users=data;
                $(".users").html(displayUser(data));
            },
            error:function () {
                throw error;
            }

        });
    };
    usersView();
});
