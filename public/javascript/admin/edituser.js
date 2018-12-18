//The following pertains specifically to the edit page of the user



$(function () {

//Send ajax request to obtain the list of specialities
    var findSpeciality=function () {
        $.ajax({
            url:'/speciality',
            Type:'GET',
            dataType:'json',
            success:function (data) {

                $("#selectInterest").append(printSelect(data));
                $("#selectInterest").chosen({ width: '100%' });
                chosenSelectSetting();
            },
            error:function () {
                throw error;
            }

        });
    };
    function printSelect(data) {
        var content ="<option  value='"+"'></option>" +
            "<optgroup label='Academics'>";
        for(var i=0; i<data.speciality.academics.length; i++){
            content+="<option>"+data.speciality.academics[i]+"</option>";

        }
        content +="</optgroup>" +
            "<optgroup label='Extracurricular Activities'>";
        for(var j=0; j<data.speciality.interests.length; j++){
            content+="<option>"+data.speciality.interests[j]+"</option>";
        }
        content +="</optgroup>";

        return content;

    }
    findSpeciality();

    //pertaining to the chosen select
    function chosenSelectSetting() {
        var config = {
            '.chosen-select'           : {},
            '.chosen-select-deselect'  : {allow_single_deselect:true},
            '.chosen-select-no-single' : {disable_search_threshold:10},
            '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
            '.chosen-select-width'     : {width:"95%"}
        };

        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }
        $("#selectInterest").val(newinterest);
        $('#selectInterest').trigger('chosen:updated');

    }







    //when the button to change password is clicked
    $(".changepwd").eq(0).click(function () {
        $(this).remove();
        $("#lastItem").after("<div class='form-group row'>" +
            "<label class='col-xs-2 col-form-label'>New Password</label>" +
            "<div class='col-xs-10'>" +
            "<input class='form-control' type='password' id='password'  required>" +
            "</div>" +
            "</div>"
        );

    });

    $("#updateBtn").click(function () {
        
        var userId=$("#username").parent().attr("id");
        var userData={};
        userData.local={};

        //The following lines collect the updated information from the form
        userData.local.email=$("#email").val();

        //check if the admin changed the password
        var temp=$("#password").val();
        if(temp == undefined){
            console.log($(".changepwd").eq(0).attr("id"));
            userData.local.password=$(".changepwd").eq(0).attr("id");
        }else{
            userData.local.password=$("#password").val();
        }
        userData.local.username=$("#username").val();
        userData.local.stunum=$("#stunum").val();
        userData.local.birthday=$("#birthday").val();
        userData.gender=$("#gender").val();
        userData.givenname=$("#givenname").val();
        userData.familyname=$("#familyname").val();
        userData.specialty=$("#selectInterest").val();

        $.post('/user?id='+userId, userData,  function(data) {
            console.log(data);
            
        }).fail(function(){
            console.log("There was an error");
        });


    });






});