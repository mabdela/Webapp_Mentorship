// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// var Admin = require('../models/admin');
// var Chatroom = require('../models/chatroom');
// var User = require('../models/user');
// var Request = require('../models/request');
var fs = require('fs');


//var User = mongoose.model('User', userSchema);

  var user_list =  readJson("user_new.json");

  //var user_list = users.users;
  //console.log(users);
  for(var i = 0; i<user_list.length; i++){
    console.log(user_list[i].specialty);
    user_list[i].local = {};
    user_list[i].local.email = user_list[i].email;
    user_list[i].local.password = "$2a$08$6trpe7TET3mMj89oPs9U9uCc1zhf76MPxcs7yrcJtRhovwk.mYxpq";
    user_list[i].local.username = user_list[i].Username;
    user_list[i].local.stunum = user_list[i].stunum;
    user_list[i].local.birthday = user_list[i].birthday;
    // if(user_list[i].specialty){
    //   var one = user_list[i].specialty.academic[0];
    //   var two = user_list[i].specialty.interests[0];
    //   user_list[i].specialty = [];
    //   user_list[i].specialty.push(one);
    //   user_list[i].specialty.push(two);
    // }else {
    //   user_list[i].specialty = [];
    // }

    user_list[i].contacts = [];

    delete  user_list[i].email;
    // delete  user_list[i].hashedPassword;
    delete  user_list[i].Username;
    delete  user_list[i].stunum;
    delete  user_list[i].birthday;
    // delete  user_list[i].signup_date;
  }
  users = {"users": user_list};
  writeJson("m_data.json",users);



// var = "Aboriginal Studies","Accounting","African Studies","American Studies", "East Asian Studies","Animal Physiology","Anthropology","Statistics","Mathematics", "Archaelogy","Architectural Studies" ,"Art and Art History", "Behaviour, Genetics and Neurobiology", "Biochemistry","Ecology",  "Biodiversity and Conservation Biology", "Bioethics","Bioinformatics","Bioinformatics and Computational Biology", "Biological Chemistry","Canadian Studies","Chemistry",
// "Christianity and Culture", "Cinema Studies", "Cognitive Science", "Computer Science","Criminology","Engineering","Linguistics","Tennis","Swimming", "Basketball","Baseball","Programming","Image Editing", "Blogging","Reading","Writing","Playing Instruments","Piano", "Violin", "Olympics","Teaching", "Volunteering", "Cooking",
// "Cleaning","Gardening","Arts and Crafts", "Forestry","Makeup and Beauty","Birdwatching", "Walking", "Cosplaying","Origami","Video Gaming", "Flower Arranging", "Yoga","Modeling","Magic"
//

  function readJson(url){
  	var data = fs.readFileSync(url, 'utf-8');
  	return JSON.parse(data);
  }

  //write to json file
  function writeJson(url, JObj){
  	var data =JSON.stringify(JObj);
  	fs.writeFileSync(url, data);
  	console.log("Export Account Success!");
  }
  //
  // function onInsert(err, result) {
  //     if (err) {
  //       console.log(err);
  //         // TODO: handle error
  //     } else {
  //         console.log(result);
  //     }
  // }
