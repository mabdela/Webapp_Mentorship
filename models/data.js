var mongoose = require('mongoose');

// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called gillers.
 */

var meeting_invi_schema= new Schema({
    mentor_id: {
        type: String,
        required: true
    },
    meeting_time:{
      type : String,
      requried: true
    },
    meeting_content:{
      type : String,
    },
    meeting_mentees:[
      {
        mentee_id: {
            type: String
        },
        confirmed: {
            type: Boolean,
            default:false
        }
      }
    ]

}, {
    collection: 'meetings'
});



var Meeting_Invitation = mongoose.model('Meeting', meeting_invi_schema);
// Doc for Mongoose Models: http://mongoosejs.com/docs/models

module.exports = Meeting_Invitation;
