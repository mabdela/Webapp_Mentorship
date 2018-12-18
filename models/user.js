// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
// define the schema for our user model
var userSchema = new mongoose.Schema({
    local: {
        email: {
            type: String,
            unique: true,
            sparse: true
        },
        password: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
            sparse: true
        },
        stunum: {
            type: String,
            unique: true,
            sparse: true
        },
        birthday: {
            type: String
        }
    },

    facebook: {
        // id returns a number, not a name
        id: {
            type: String,
            unique: true,
            sparse: true
        },
        token: {
            type: String
        },
        email: {
            type: String
        }
    },


    third_party: { type: Boolean, default: false },

    gender: { type: String },
    givenname: { type: String },
    familyname: { type: String },

    //type: path to the profile picture, default: default profile picture
    profilePicture: { type: String, default: "assets/img/default-profile-pic.png" },
    about: { type: String, default: "Welcome to my profile!" },
    role: { type: String, default: "mentee" },
    specialty: [String],

    contacts: [
        {
            name: {
                type: String,
                required: true
            },
            pic: {
                type: String
            },
            id: {
                type: String,
                required: true
            },
            relation: {
                type: String,
            },
            room_id: {
                type: String,
                required: true
            }
        }
    ]
}, {
    collection: 'users'
});


// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


var User = mongoose.model('User', userSchema);


  var URL = path.join(__dirname, '/m_data.json')
  var users =  readJson(URL);
  User.collection.insert(users.users,onInsert);

function onInsert(err, result) {
    if (err) {
      console.log("User list Already inserted!");
        // TODO: handle error
    } else {
      console.log(result.insertedCount + " Users inserted successfully!");  //console.log(result);
    }
}
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
