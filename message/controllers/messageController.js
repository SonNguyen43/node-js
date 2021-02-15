const db = require('../database/connect.js');

module.exports = function(app){
    // get message
    app.get('/message', function(req, res){
        if (!req.session.user) res.redirect('/login')
        else {
            db.query('SELECT * FROM chat_message', function(error, results, fields){
                res.render('message',{user: req.session.user, messages: results})
                res.end()
            });
        }
    })

    // add message to DB
    app.post('/message', function(req, res){
        const {message, user_id} = req.body

        // Get the current date
        var today = new Date();
        var timestamp = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + " " + today.getHours() + ':'+today.getMinutes()+':'+today.getSeconds();

        db.query('INSERT INTO chat_message (user_id, message, timestamp) VALUES (?,?,?)', [user_id,message,timestamp] ,function(error, results, fields){
            if(error) throw error
            else res.send('success')
            res.end()
        });
    })
}