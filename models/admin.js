var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminSchema= new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true,unique: true },
    password: { type: String, required: true }

}, {
    collection: 'admins'
});



// generating a hash
adminSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('Admin', adminSchema);
var Admin = mongoose.model('Admin', adminSchema);


var data = {
  "username": "csc309TAs",
  "email" : "web@web.com",
  "password" : "$2a$08$6trpe7TET3mMj89oPs9U9uCc1zhf76MPxcs7yrcJtRhovwk.mYxpq"
};

Admin.collection.update(data, data, {upsert:true})
