//middleware func through which all reqs that can't be accessed without login would go through,
//redirects directly to /login
module.exports = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    next();
}