// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../models/user');
var Admin       = require('../models/admin');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // PASSPORT SESSION SIGNUP ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({

        usernameField : 'username',
        passwordField : 'password',

        // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback : true
    },

    function(req, username, password, done) {

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.username' :  username }, function(err, user) {

                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user){
                  console.log('loginMessage No user found.');
                    return done(null, false, req.flash('loginMessage', 'No user found.'));}

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });



    }));


    // LOCAL SIGNUP ============================================================

    passport.use('local-signup', new LocalStrategy({

        usernameField : 'username',
        passwordField : 'password',

        //allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log(JSON.stringify(req.body));

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.username' :  username }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.username    = username;
                        newUser.local.email    = req.body.email;
                        newUser.local.password = newUser.generateHash(password);

                        //newUser.local.username    = req.body.username;
                        newUser.local.stunum    = req.body.stunum;
                        newUser.givenname    = req.body.givenname;
                        newUser.familyname    = req.body.familyname;
                        newUser.gender    = req.body.gender;
                        newUser.local.birthday    = req.body.birthday;

                        // An string of comma interests "Swimming, Basketball, ..."
                        newUser.specialty = req.body.specialty;
                       // var interests_array = interests.split(',');

                      //  newUser.specialty = interests_array;
                        newUser.profilePicture = req.body.profilePicture;
                        console.log("just before"+JSON.stringify(newUser));

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });

            } else if ( !req.user.local.email ) {

                // CASE: If the user is logged in but has no local account...
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

    // =========================================================================
    // ADMIN  ================================================================
    // =========================================================================

    passport.use('admin-login', new LocalStrategy({

        usernameField : 'username',
        passwordField : 'password',

        // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback : true
    },

    function(req, username, password, done) {

        // asynchronous
        process.nextTick(function() {
            Admin.findOne({ 'username' :  username }, function(err, user) {

                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user){
                  console.log('loginMessage No user found.');
                    return done(null, false, req.flash('loginMessage', 'No user found.'));}

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });
    })); // end of admin login

    // ADMIN SIGNUP =================================================

    passport.use('admin-signup', new LocalStrategy({

        usernameField : 'username',
        passwordField : 'password',

        //allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log(JSON.stringify(req.body));

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                Admin.findOne({ 'username' :  username }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newAdmin = new Admin();

                        newAdmin.username    = username;
                        newAdmin.email    = req.body.email;
                        newAdmin.password = newAdmin.generateHash(password);

                        newAdmin.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newAdmin);
                        });
                    }

                });

            } else if ( !req.admin.username ) {

                // CASE: If the user is logged in but has no local account...
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                Admin.findOne({ username :  username }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That username is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var admin = req.admin;
                        admin.username = username;
                        admin.password = admin.generateHash(password);
                        admin.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null,admin);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.admin);
            }

        });

    }));




    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
    function(req, token, refreshToken, profile, done) {
        //console.log(req);
        //console.log(profile);
        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.gender = profile.gender;
                            user.givenname = profile.name.givenName;
                            user.familyname = profile.name.familyName;
                            user.third_party = true;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                            user.profilePicture = "http://graph.facebook.com/" +profile.id +"/picture?type=large";

                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new User();
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.gender = profile.gender;
                        newUser.givenname = profile.name.givenName;
                        newUser.familyname = profile.name.familyName;
                        newUser.third_party = true;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                        newUser.profilePicture = "http://graph.facebook.com/" +profile.id +"/picture?type=large";
                        newUser.save(function(err) {
                            if (err){
                            console.log("save error");
                                return done(err);}

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.gender = profile.gender;
                user.givenname = profile.name.givenName;
                user.familyname = profile.name.familyName;
                user.third_party = true;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                user.profilePicture = "http://graph.facebook.com/" +profile.id +"/picture?type=large";

                user.save(function(err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }
        });

    }));



};
