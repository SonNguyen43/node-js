// get URL
module.exports = function(app){
    app.get('/', function(req, res){
        // check existence of session
        if (!req.session.user)  res.render('login',{message: ""})
        else res.redirect('/dashboard')
    })

    app.get('/register', function(req, res){
         // check existence of session
        if (!req.session.user)  res.render('register',{message: ""})
        else res.redirect('/dashboard')
    })

    app.get('/login', function(req, res){
         // check existence of session
        if (!req.session.user) res.render('login',{message: ""})
        else res.redirect('/dashboard')
    })

    app.get('/dashboard', function(req, res){
         // check existence of session
        if (!req.session.user) res.redirect('/login')
        else res.render('dashboard',{user: req.session.user})
    })
}