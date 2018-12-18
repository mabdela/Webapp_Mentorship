$(function () {
    //The following function remove the class active from the main menu and sidebar navigation
    var resetActive=function () {

        //Remove active class from the main menu
        var countMainMenuItems=$("nav div li").length;
        for(var i=0;i<countMainMenuItems; i++ ){

            if($("nav div li").eq(i).hasClass("active")){
                $("nav div li").eq(i).removeClass("active");
            }
        }

    };


    //The following section pertaining to the autocomplete function
    var availableTags=[];//array containing full name of users
    var findAllUsersFullName=function () {
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
                constructFullName(data);
            },
            error:function () {
                throw error;
            }

        });
    };
    //concatenate first and last name, then push to the array.
    var constructFullName=function (data) {
        for(var i=0; i<data.length; i++){
            availableTags.push(data[i].givenname+" "+data[i].familyname);
        }
    };

    //call the function to find all the user names
    findAllUsersFullName();
    $( "#tags" ).autocomplete({
        source: function(request, response) {
            var results = $.ui.autocomplete.filter(availableTags, request.term);

            response(results.slice(0, 10));
        }
    });

    //Find a user with a given full name
    $("#searchUsers").click(function (e) {
        e.preventDefault();
        resetActive();
        var userName=$("#tags").val();
        console.log(userName);
        $(".searchResults").html("");
        $(".searchResults").show();
        $(".searchResults").siblings("div").hide();
        $.ajax({
            url:'/users?fullname='+userName,
            Type:'GET',
            dataType:'json',
            success:function (data) {

                if(data.length){
                    $(".searchResults").html(displayUser(data));
                }else{
                    $(".searchResults").html("<span class='wrong'>There is no user with the name: "+userName+"</span>");
                }
                //resetting the result for the previous search
                $('#tags').val("");

            },
            error:function () {
                throw error;
            }

        });


    });


    //remove a user when the trash button corresponding to the user is clicked
    window.deleteUser=function (that) {
        console.log("deleting a user");
        var userId=$(that).parent().parent().parent().attr("id");
        console.log(userId);
        $("#"+userId).remove();

        $.ajax({
            url:'/user?id='+userId,
            type:'DELETE',
            success:function () {
                console.log("Deleted a user");

            }
        });

    };

    var countMentorRequest=function(){
        $.ajax({
            url:'/mrequests',
            Type:'GET',
            dataType:'json',
            success:function (data) {
                if(data.length){
                    $("#badgenum").html(data.length);
                }
            },
            error:function () {
                throw error;
            }

        });
    };
    countMentorRequest();
});

//a variable to keep track of the number of users being displayed
var usersData;
var factor=0;
//displaying a given user on the admin page
var displayUser=function (data) {
    usersData=data;
    var content = "";
    content += "<div class='row'>" +
        "<div class = 'col-sm-5'>" +
        "<div class='row'>";
    content+=constructContent(data);
    content += "</div>" +
        "</div>" +
        "</div>";
    return content;
};


//constructing the information to be displayed for the users
var constructContent=function (data) {
    var content= "";
    var lengthOfData=data.length;//getting the array size
    for (var i = 0; i < lengthOfData; i++) {
        //For a given user
        content += "<div class='media mentor-box' style='float:left' id='" + data[i]._id + "'>" +
            "<a class='pull-left' href='#'>" +
            "<img class='media-object' data-src='holder.js/64x64' alt='64x64' style='width: 60px; height: 60px;' src='" + data[i].profilePicture + "'>" +
            "</a>" +
            "<div class='media-body'>" +
            "<h5 class='media-heading'>" + data[i].givenname + " " + data[i].familyname + "</h5>" +
            "<a class='customColor'>" + data[i].specialty[0] + "</a>" + "<div class='pull-right'>" +
            "<a href = '/edit?id=" + data[i]._id + "' class = 'btn btn-primary' role = 'button'>" +
            "<span class='glyphicon glyphicon-pencil'></span>" +
            "</a>" +
            "<button class = 'btn btn-default removeUser' role = 'button' onclick='deleteUser(this)'>" +
            "<span class='glyphicon glyphicon-trash'></span>" +
            "</button>" +
            "</div>" +
            "</div>" +
            "</div>";
        if(i>=50){
            content+="<center id='viewmore'><a  class='btn btn-info' role='button' onclick='showMore()' style='margin-top:16px'>View More Users</a></center>";
            factor++;

            break;
        }
    }
    return content;

}


//Show more users whenever the button view More is clicked
function showMore() {

    var viewmore=document.querySelector('#viewmore');
    usersData.splice(0, 51);//remove those already showed

    var content= constructContent(usersData);

    var divElement = document.createElement('div');
    divElement.innerHTML=content;


    viewmore.parentNode.replaceChild(divElement, viewmore);

};

