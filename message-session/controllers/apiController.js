const db = require('../database/connect.js');

module.exports = function(app){
    app.get('/api/message', function(req, res){
        db.query('SELECT * FROM chat_message', function(error, results, fields){
            res.send(results)
            res.end()
        });
    })
}