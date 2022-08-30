module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()){
            return next()
        } else {
            req.flash('error_msg', 'You must be logged in to access this page.')
            res.redirect('/users/login')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}