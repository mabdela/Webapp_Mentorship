// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1651440105155235', // your App ID
        'clientSecret'    : 'a938a07be870b910932026eb097f26f2', // your App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['id', 'emails', 'gender', 'name']
    }
};
