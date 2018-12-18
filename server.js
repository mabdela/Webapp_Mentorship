// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

// required for file download
var mime = require('mime');


var morgan = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser   = require('body-parser');
var session      = require('express-session');
var formidable = require('formidable');
var fs = require('fs');
var User = require('./models/user');
var Request= require('./models/request');

// Database name set to MentorRock
var configDB = require('./config/database.js');

// Initialize a new socket.io object. It is bound to
// the express app, which allows them to coexist.
var io = require('socket.io').listen(app.listen(port));




// views and public  ===============================================================

var path = require('path');

// Set views path, template engine and default layout
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for all of our ejs files
app.set('views', path.join(__dirname, 'views'));

// configuration ===============================================================
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'MentorRock-sessions', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// MENTOR APPLICATION FORM SUBMISSION
var uploaded_file="";
app.post('/upload', function(req, res) {
        
        
          // create an incoming form object
          var form = new formidable.IncomingForm();

          // specify that we want to allow the user to upload multiple files in a single request
          form.multiples = true;

          // store all uploads in the /uploads directory
          form.uploadDir = path.join(__dirname, '/uploads');

          // every time a file has been uploaded successfully,
          // rename it to it's orignal name
          form.on('file', function(field, file) {
			  
                fs.rename(file.path, path.join(form.uploadDir, file.name));  
          });
        
          // log any errors that occur
          form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
          });

          // once all the files have been uploaded, send a response to the client
          form.on('end', function(fields, files) {
              
                /* Temporary location of our uploaded file */
                var temp_path = this.openedFiles[0].path;
              
                /* The file name of the uploaded file */
                var file_name = this.openedFiles[0].name;
				uploaded_file=file_name;
              

              
                res.end('success');       
          });
		  
		  console.log("The user two: "+req.user);
		  

          // parse the incoming request containing the form data
          form.parse(req);
        
        // ===================================================================
    
        // After completing fields update, redirect to user's home page
        res.redirect('/profile');
        
    }); 


    
// MENTOR APPLICATION FORM SUBMISSION
app.post('/mentorapp', function(req, res) {
        
    // ===================================================================    
        

		var userData={};
        userData.givenname=req.user.givenname;
        userData.familyname=req.user.familyname;
        userData.userID = req.user._id;
        userData.interests=req.body.mentor_interests;
        userData.academics = req.body.mentor_academic;
        userData.experience_field = req.body.mentor_field;
        userData.experience_work = req.body.mentor_experience;
        userData.voluntary = req.body.mentor_voluntary;
        userData.additionals = req.body.mentor_additionals;
		
        userData.cv = uploaded_file;
		console.log("fname: "+uploaded_file);


        var newUser = new Request(userData);

        newUser.save(function(err, newUser) {
         if (err) throw err;
         console.log("New User: "+ JSON.stringify(newUser));

        });
		console.log("Hey Bro"+req.body.mentor_academic +req.body.mentor_interests+ req.body.mentor_field);
		
		console.log("The user data: "+JSON.stringify(userData));
        

        

        
        // FILE UPLOADING USING FORMIDABLE
        
        //var cover_letter = req.user.mentorapp.cv;
        
          // create an incoming form object
          var form = new formidable.IncomingForm();

          // specify that we want to allow the user to upload multiple files in a single request
          form.multiples = true;

          // store all uploads in the /uploads directory
          form.uploadDir = path.join(__dirname, '/uploads');

          // every time a file has been uploaded successfully,
          // rename it to it's orignal name
          form.on('file', function(field, file) {
			  
                fs.rename(file.path, path.join(form.uploadDir, file.name));  
          });
        
          // log any errors that occur
          form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
          });

          // once all the files have been uploaded, send a response to the client
          form.on('end', function(fields, files) {
              
                /* Temporary location of our uploaded file */
                var temp_path = this.openedFiles[0].path;
              
                /* The file name of the uploaded file */
                var file_name = this.openedFiles[0].name;
              

				console.log("fname: "+uploaded_file);
              
                res.end('success');       
          });
		  
		  console.log("The user two: "+req.user);
		  

          // parse the incoming request containing the form data
          form.parse(req);
        
        // ===================================================================
    
        // After completing fields update, redirect to user's home page
        res.redirect('/profile');
        
    }); 
	
	
	app.get('/download', function(req, res){
		
		var userId = req.query.id;
		console.log("The user ID: "+userId);

        Request.findOne({userID: userId}, function(err, userData) {
          
        console.log("Find: "+userData);

            
        var file = __dirname + '/uploads/'+ userData.cv;

        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
		
        });
		

    });


// routes ======================================================================

// load our routes and pass in our app and fully configured passport
// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.
require('./routes/routes.js')(app, passport);

require('./routes/chat-routes.js')(app, io);

require('./routes/admin-routes.js')(app, passport);
require('./routes/add-contacts.js')(app, passport);
// launch ======================================================================
//app.listen(port);
console.log('MentorRock is running on port ' + port);
