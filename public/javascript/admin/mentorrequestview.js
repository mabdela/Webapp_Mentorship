$(function () {
    //Ajax request to find users data
    $("#addMentors").addClass("active");

    //The following part pertaining to mentor request page


    var displayRequests=function(){
        $.ajax({
            url:'/mrequests',
            Type:'GET',
            dataType:'json',
            success:function (data) {

                if(data.length){
                    $(".mentorRequest").html(contentFormat(data));
                }else{
                    $(".searchResults").html("<span class='success'>There is no Mentor Request</span>");
                }
                //resetting the result for the previous search
                $('#tags').val("");

            },
            error:function () {
                throw error;
            }

        });
    };


    //The following display the users who requested to become a mentor
    var contentFormat = function(data){
        var content="";
        content+="<div class='row'><div class = 'col-sm-5'><div class='row'>";
        for(var i=0; i<data.length; i++){

            content+="<div class='media mentor-box' id='"+data[i]._id+"'>" +
                "<a class='pull-left' href='#'>" +
                "<img class='media-object' data-src='holder.js/64x64' alt='64x64' style='width: 60px; height: 60px;' src='"+data[i].profilePicture+"'>" +
                "</a>" +
                "<div class='media-body'>" +
                "<h5 class='media-heading'>"+data[i].givenname+" "+data[i].familyname+"</h5>" +
                "<a>"+data[i].specialty[0]+"</a>" +
                "<div class='pull-right'>" + "<a href = '/request?id=" + data[i]._id + "' class = 'btn btn-primary btn-circle' role = 'button'>" +
                "<span class='glyphicon glyphicon-list-alt'></span>" +
                "</a>" +
                "<a href = '/edit?id=" + data[i]._id + "' class = 'btn btn-default btn-circle' role = 'button'>" +
                "<span class='glyphicon glyphicon-pencil'></span>" +
                "</a>" +
                "</div>" +
                "</div>" +
                "</div>";
        }
        content += "</div></div></div>";

        return content;
    };

    //Run the function whenever on this page
    displayRequests();

    //accept mentor request
    window.acceptRequest=function (that) {
        console.log("accept a mentor request");
        //var userId=$(that).parent().parent().parent().attr("id");
        console.log(userId);
       // $("#"+userId).remove();

        $.ajax({
            url:'/acceptmentor?id='+userId,
            type:'DELETE',
            success:function () {
                console.log("finished accepting");

            }
        });

    };

    //reject mentor request
    window.rejectRequest=function (that) {
        console.log("reject a mentor request");
        //var userId=$(that).parent().parent().parent().attr("id");
        console.log(userId);
        //$("#"+userId).remove();

        $.ajax({
            url:'/rejectmentor?id='+userId,
            type:'DELETE',
            success:function () {
                console.log("Finished rejecting");

            }
        });

    };

});
