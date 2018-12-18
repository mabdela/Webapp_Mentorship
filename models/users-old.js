var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var userSchema = new Schema(
{
	username: {
		type: String, required: true, unique: true
	},
	givenname: {
		type: String, required: true
	},
	familyname: {
		type: String, required: true
	},
	stunum:{
		type: Number, required: true, unique: true
	},
	email: {
		type: String, required: true, unique: true
	},
	hashed: {
		type:String, required: true
	},
	salt:{
		type:String, required: true
	},
	role: {
		type: String, required:true, //the role can be "mentee" or "mentor"
	},
	specialty:[String],
	profilePicture:{//path to the profile picture
		type: String, default:"defaultPicture" //some default profile picture 
	},
	gender: {
		type: String, required:true
	},
	birthday: {
		type: Date, required: true
	},

    signup_date:Date.now, //signed up date
	
	about:{
		type: String, default: "Default text" //Default text about the user
	}
			
},
{
	collection: 'newUsers'
}
);

module.exports = mongoose.model('Users', userSchema);