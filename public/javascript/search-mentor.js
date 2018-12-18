
    var userId="<%- user._id %>";

    // resetting this to new input template
    var interest ="";
    var newinterest;
    if (interest.indexOf(',') == -1) {
        newinterest=interest;
    }else{
        newinterest=interest.split(",");
    }

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
        $("#searchInterest").click(function () {
          $('#result').html("");
            var interestData=$("#selectInterest").val();
            console.log(interestData);
            var formatted={};
            formatted.specialty=[];
            for (var i=1; i<interestData.length; i++){

                formatted.specialty.push(interestData[i]);
            }
            $.ajax({
              url: '/getmentors',
              type: "GET",
              data: formatted,
              success: function(response){
                  buildMentorTable(response);
              },
              error: function (request, status, error) {
                  alert(request.responseText);
              }
            });
        });

        $("#searchUsername").click(function () {
            $('#result').html("");
            var usernameData= $("input[name='username']").val();
            usernameData = $.trim(usernameData);
            console.log(usernameData);
            
            $.ajax({
              url: '/getmentor?username=' +usernameData,
              type: "GET",
              success: function(response){
                  buildMentorTable(response);
              },
              error: function (request, status, error) {
                  alert(request.responseText);
              }
            });
        });

        function buildMentorTable(response){

        $('#result').append($('<h1>Query Result</h1>'));
        for(var i = 0; i<response.length; i++){
          var new_div = $('<div class="col-sm-4 col-md-4 col-lg-4" id="' +response[i]._id +'"></div>');
          var profile_pic = $('<img class="avatar" src="'+response[i].profilePicture+'" alt="">');
          var name_span = $('<span id="friend-name"><a href="/userprofile?id='+response[i]._id+'">'+ response[i].givenname +' '+response[i].familyname+ '</a></span><br>');
          var visit_button = $('<button id="' +response[i]._id +'" class="btn btn-success" onclick="addcontact(this.id)">Add Mentor</button>');
          new_div.append(profile_pic);
          new_div.append(name_span);
          new_div.append(visit_button);
          $('#result').append(new_div);
        }
      }

       function addcontact(clicked_id) {
         clicked_id =$.trim(clicked_id);
         console.log(clicked_id);
         $.ajax({
           url: '/addmentors',
           type: "POST",
           data: {id : clicked_id},
           success: function(response){
               alert(response);
           },
           error: function (request, status, error) {
               alert(request.responseText);
           }
         });
       }
