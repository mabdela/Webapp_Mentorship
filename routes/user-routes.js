var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var fs = require('fs');
var Request= require('../models/request');
var mongoose = require('mongoose');


 /*//Inserting data from a file
 var userObj;
 fs.readFile('routes/sample/fewUsers.json', 'utf-8', function(err, data) {
     if(err) throw err;
     userObj = JSON.parse(data);//parsing the data
     for(var i=0; i<userObj.users.length; i++){
         addNewUser(userObj.users[i]);//call the function below to add a new user into the database
     }

 });*/

/*User.find({role:"mentee"}, function(err, allUsers) {
    if (err) throw err;
    console.log(JSON.stringify(allUsers[0]._id));
    for(var i=0; i<1; i++){

        var data={};
        data.userID=allUsers[0]._id;
        var newRequest=new Request(data);
        newRequest.save(function (err, newReq) {
            if(err) throw err;
            console.log("The new request: "+JSON.stringify(newReq));
        });
    }

});*/

//Find users who requested to become a mentor
exports.findMentorRequest=function (req, res) {
    Request.find({}, function(err, allIds) {
        if (err) throw err;
        var userIds = [];
        for (var i=0; i<allIds.length;i++) {
            userIds.push(new mongoose.Types.ObjectId(allIds[i].userID));
        }
        User.find({_id: {$in: userIds}}, function (err, users) {
            if (err) throw err;
            else {
                console.log("Mentor Request ");
                res.send(users);
            }
        });
    });

};


//Adding a new user to the database
function addNewUser(data){
    console.log("added a user");
    var newUser = new User(data);
    newUser.save(function(err, newUser) {
        if (err) throw err;
    });
};

/**
 *
 * @param {object} req request object
 * @param {object} res response object
 */
exports.findAll = function(req, res) {
    if(!req.query.role&&!req.query.fullname){
        User.find({}, function(err, allUsers) {
            if (err) throw err;
            res.send(allUsers);
        });
    }else if(req.query.role != undefined) {//when searching for a "mentor" or "mentee".
        User.find({role:req.query.role}, function(err, selectedUsers) {
            if (err) throw err;
            res.send(selectedUsers);
        });

    }else if(req.query.fullname != undefined){//Find users using full name
        var fullname=req.query.fullname;
        var names = fullname.split(" ");
        console.log(fullname);
        User.find({givenname:names[0], familyname:names[1]}, function(err, selectedUsers) {
            if (err) throw err;
            res.send(selectedUsers);
        });
    }
        var fullname=req.query.fullname;


};


///------------------------- add new user -------------------------
exports.addUser = function(req, res) {
	console.log("addOne");
    console.log(req.body);
    var userData=req.body;

    //encrypt the password
    userData.local.password = bcrypt.hashSync(userData.local.password, bcrypt.genSaltSync(8), null);
    //create the user
    var newUser = new User(userData);

    newUser.save(function(err, newUser) {
        if (err) throw err;
        res.send('Success');
    });
};

//-----------delete a users with a given id -----------------
exports.deleteOne = function(req, res) {
    console.log("deleteOne: "+req.query.id);
    User.remove( { _id : req.query.id }, function (err, user){
        if(err)throw err;
    });
};




///--------------update all user information----------------------

exports.updateUser=function (req, res) {
   findUserById(req.query.id);

    var updatedData=req.body;

    //assuming the password length is less than 20 characters
    if(req.body.local.password.length<20){

       updatedData.local.password = bcrypt.hashSync(updatedData.local.password, bcrypt.genSaltSync(8), null);
    }

   User.update({_id: req.query.id}, {$set: updatedData}, function(err, updated) {
        if( err || !updated ){
            console.log("User not updated");
        }else{
            console.log("User updated");
        }
    });
};


//reject a mentor request and remove from the Request collection
exports.acceptMentorReq=function (req, res) {
    console.log("Reject one: "+req.query.id);
    Request.remove( { userID : req.query.id }, function (err, user){
        if(err)throw err;
        User.update({_id: req.query.id}, {$set: {role:"mentor"}}, function(err, updated) {
            if( err || !updated ){
                console.log("User not updated");
            }else{
                console.log("User updated");
            }
            res.send("success");
        });
    });
};


//reject a mentor request and remove from the request collection
exports.rejectMentorReq=function (req, res) {
    console.log("Reject one: "+req.query.id);
    Request.remove( { userID : req.query.id }, function (err, user){
        if(err)throw err;
        res.send("success");
    });
};

exports.checkPwd = function(req, res) {
    console.log('like: ' + req.params.id);
   // TODO
   User.findOne({id: req.params.id}, function(err, thatUser) {
      res.send(thatUser);
   });
};

//The following sends the speciality list
exports.findSpeciality=function(req, res){

    fs.readFile('routes/sample/specialitylist.json', 'utf-8', function(err, data) {
        if(err) throw err;
        res.send(data);
    });
};

///------------------------- find user -------------------------
exports.findById = function(userId) {

	 User.findOne({_id: userId}, function(err, thatUser) {
	     console.log("find by id:"+thatUser);
	 });

};



var findUserById = function(userId) {

    User.findOne({_id: userId}, function(err, thatUser) {
        console.log("find by id:"+thatUser);
        return thatUser;
    });

};
exports.fineBySpecialty = function(req, res) {
	 // TODO
	 User.findOne({specialty: req.params.specialty}, function(err, thatUser) {		
	    res.send(thatUser);
	 });	 
};

exports.updatePwd= function(req, res) {
  //TODO :  encode the pwd before send to server
	User.update({id: res.params.id}, {$set: {hashed: res.params.hashed, salt : res.params.salt}}, function(err, updated) {
  		if( err || !updated ) console.log("User not updated");
  		else console.log("User updated");
	});
};

exports.updateFname= function(req, res) {
	User.update({id: res.params.id}, {$set: {familyname: res.params.fname}}, function(err, updated) {
  		if( err || !updated ) console.log("User not updated");
  		else console.log("User updated");
	});
};

exports.updateGname= function(req, res) {
	User.update({id: res.params.id}, {$set: {givenname: res.params.gname}}, function(err, updated) {
  		if( err || !updated ) console.log("User not updated");
  		else console.log("User updated");
	});
};




exports.updateMentor= function(req, res) {

   User.findOne({id: req.params.id}, function(err, thatUser) {    
      if( err ) console.log("User not updated");
      else console.log("User updated");
      thatUser.specialty.push(res.params.specialty);
      thatUser.save(function(err, thatUser) {
      if (err) throw err; 
      });
      //TODO : whether to resend info
   });  
};

//Update speciality in the users page
exports.updateSpecialty= function(req, res) {

    User.findOne({_id: req.query.id}, function(err, thatUser) {
        if( err ) console.log("User not updated");
        else console.log("User updated");
        thatUser.specialty.push(req.body);
        thatUser.save(function(err, thatUser) {
            if (err) throw err;
        });

    });
};

//Apply the required format to the users input
function formatInput(data){

    var formattedData={};
    formattedData.local={};
    formattedData.local.email=data.email;
    formattedData.local.password=data.password;
    formattedData.local.username=data.username;
    formattedData.local.stunum=data.stunum;
    formattedData.local.birthday=data.birthday;
    formattedData.gender=data.gender;
    formattedData.givenname=data.givenname;
    formattedData.familyname=data.familyname;
    formattedData.thirdparty=false;
    formattedData.profilePicture="default Pic";
    formattedData.about=data.about;
    formattedData.role=data.role;
    formattedData.specialty=data.specialty;
    return formattedData;
}
