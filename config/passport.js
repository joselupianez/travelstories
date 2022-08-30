const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'username'
    },
    async (username, password, done) => {
        try {
            let user = await User.findOne({ username: username })
            if(user) {
                // Match password
                bcrypt.compare(password, user.password, (err,isMatch) => {
                    if(err) throw err

                    if(isMatch) {
                        done(null, user)
                    }else{
                        done(null, false, {message: 'Invalid password.'})
                    }
                })
            } else {
                done(null, false, {message: 'Username does not exist.'})
            }
        } catch (err) {
            console.error(err)
        }
    }))

    passport.serializeUser((user, done) => {
        process.nextTick(() => {
          return done(null, user.id);
        });
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id,(err, user) => {
          if (err) { return done(err); }
          return done(null, user);
        });
    });
}