const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const socket = require('socket.io');

// controller
const pagesController =  require('./controllers/pagesController.js')
const userController =  require('./controllers/userController.js')
const messageController =  require('./controllers/messageController.js')
const apiController =  require('./controllers/apiController.js')

const app = express()
app.set('view engine','ejs')
app.use(cookieParser())
app.use(express.static('./public')) // static file
app.use(express.urlencoded({extended: false})) // phân tích cú pháp được mã hóa url (như được gửi bằng mẫu html)
app.use(express.json())

app.use(session({
	secret: 'keyboard',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 * 60 }
}))

// user controller
pagesController(app)
userController(app)
messageController(app)
apiController(app)

// listen port
var server = app.listen(3000, function(){
  	console.log('Server đang mở cổng 3000');
});

// Socket setup
var io = socket(server);
io.on('connection', (socket) => {
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});


