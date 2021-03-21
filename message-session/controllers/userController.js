const db = require('../database/connect.js')
const bcrypt = require('bcryptjs')

module.exports = function(app){
    // login
    app.post('/login', async (req, res) => {
        try {
            const {email, password} = req.body

            db.query('SELECT * FROM user WHERE email = ?', [email], async (error, results, fields) => {
                if (error) throw error
                else if(results.length <= 0){
                    return res.render('login', { message: '<b>Tài khoản</b> không tồn tại trong hệ thống'})
                }else if(!results || !(await bcrypt.compare(password, results[0].password))){
                    return res.render('login', { message: '<b>Tài khoản</b> hoặc <b>mật khẩu</b> không chính xác'})
                }else{
                    req.session.userId = results[0].id; 
                    req.session.user = results[0];

                    res.redirect("/dashboard")
                }

                res.end()
            });
        } catch (error) {
            console.log(error);
        }
    }) 

    // logout
    app.post('/logout', function(req, res){
        req.session.destroy(function(err) {
            return res.render('login',{message: "", password: "", email: ""});
         })
    })

    // register
    app.post('/register', async function(req, res){
        const {display_name, email, password, password_confirm} = req.body

        const hashPassword = await bcrypt.hash(req.body.password, 10)

        db.query('SELECT * FROM user WHERE email = ?', [email], function(error, results, fields) {
            if (error) throw error
            else if(results.length > 0){
                return res.render('register', { message: '<b>Email</b> đã được sử dụng'})
            } 
            else if(password !== password_confirm){
                return res.render('register', {  message: '<b>Mật khẩu</b> không hợp lệ'})
            }
            else{
                db.query('INSERT INTO user (display_name, email, password) VALUES (?,?,?)', [display_name,email,hashPassword] ,function(error, results, fields){
                    res.end()
                });
                res.render('login', {message: 'Đã tạo thành công tài khoản <b>' +email+ "</b>"})
            } 
        })
    })
    
    // change password 
    app.post('/changePassword', async function(req, res){
        const {oldPassword, newPassword, email} = req.body

        db.query('SELECT * FROM user WHERE email = ?', [email], async (error, results, fields) => {
            if (error) throw error
            else if(!results || !(await bcrypt.compare(oldPassword, results[0].password))){
                // thất bại
                return res.send({result: 'Mật khẩu cũ không đúng !'})
            }else{
                const hashPassword = await bcrypt.hash(newPassword, 10)
                db.query('UPDATE user SET password = ? WHERE email = ?', [hashPassword, email])
                return res.send({result: 'Thay đổi thành công !'})
            }
        });
    })
}