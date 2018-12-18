$(function () {
    $("#addUsers").addClass("active");

    //when adding a user print success message
    $("#addNewUser").click(function () {
        
		
        var userData={};
        userData.local={};

        //The following lines collect the updated information from the form
        userData.local.email=$("#email").val();

        //check if the admin changed the password       
        userData.local.password=$("#password").val();
        userData.local.username=$("#username").val();
        userData.local.stunum=$("#stunum").val();
        userData.local.birthday=$("#birthday").val();
        userData.gender=$("#gender").val();
        userData.givenname=$("#givenname").val();
        userData.familyname=$("#familyname").val();
        userData.specialty=$("#selectInterest").val();
		userData.profilePicture=$("#profilePicture").val();

        $.post('/addUser', userData,  function(data) {
            console.log(data);
			$(".feedback").html("<p class='success'>Successfully added the user</p>");
			location.reload();
            
        }).fail(function(){
            console.log("There was an error");
        });

    });


});


