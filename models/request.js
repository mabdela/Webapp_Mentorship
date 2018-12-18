var mongoose = require('mongoose');

//This schema will be used to store the id of the users who requested to become a mentor
var requestSchema = new mongoose.Schema({

        userID: { type: String },
        academics: { type: String},
        interests: { type: String},
        givenname: { type: String },
        familyname: { type: String },
        experience_field: { type: String },
        experience_work: { type: String },
        cv: { type: String },
        voluntary: { type: String },
        additionals: { type: String}
    },
    {
        collection: 'request'
    }
);

// exporting the model
module.exports = mongoose.model('Request', requestSchema);
