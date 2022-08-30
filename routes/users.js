const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureGuest } = require('../middleware/auth')

// User model
const User = require('../models/User')

// @desc    Login page
// @route   GET /user/login
router.get('/login', ensureGuest, (req, res) => {
  res.render('users/login', {
    layout: 'login',
    title: 'Login'
  })
})

// @desc    Register page
// @route   GET /user/register
router.get('/register', ensureGuest, (req, res) => {
  res.render('users/register', {
    layout: 'login',
    title: 'Register'
  })
})

// @desc    Register Handle
// @route   POST /user/register
router.post('/register', ensureGuest, async (req, res) => {
  const { username, email, password, password2 } = req.body
  let errors = [];

  // Required fields
  if(!username || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields.'})
  }

  // Passwords match
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match.'})
  }

  // Password length
  if(password.length < 6){
    errors.push({ msg: 'Password should be at least 6 characters.'})
  }

  if(errors.length){
    res.render('users/register', {
      layout: 'login',
      title: 'Register',
      errors,
      username,
      email,
      password,
      password2
    })
  }else{
    // Successful validation
    try {
      const userExists = await User.findOne({$or: [{email: email}, {username: username}]})
      if(userExists){
        //User exists
        errors.push({ msg: 'Username or email is already registered.' })
        res.render('../users/register', {
          layout: 'login',
          title: 'Register',
          errors,
          username,
          email,
          password,
          password2
        })
      }else{
        const newUser = new User({
          username,
          email,
          password
        })

        // Hash password
        bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          // Set password to hash
          newUser.password = hash;
          newUser.save()
          .then(user => {
            req.flash('success_msg', 'Registration successful, you may now login!')
            res.redirect('/users/login')
          })
          .catch(err => {
            console.error(err)
            res.render('error/500')
          })
        }))
      }
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  }
})

// @desc    Login User
// @route   POST /user/login
router.post('/login', ensureGuest, async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// @desc    Logout User
// @route   GET /user/logout
router.get('/logout', (req, res, next) => {
  req.logout( err => {
    if (err) { return next(err) }
    res.redirect('/')
  })
})

module.exports = router