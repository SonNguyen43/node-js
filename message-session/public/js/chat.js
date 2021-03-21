var socket = io.connect('http://localhost:3000');

// auto scroll bottom
$("#content-message").animate({ scrollTop: $('#content-message').prop("scrollHeight")}, 1000);

// Query DOM
var message = document.getElementById('message'),
user_id  = document.getElementById('user_id'),
display_name  = document.getElementById('display_name'),
btn     = document.getElementById('send'),
output  = document.getElementById('output'),
feedback = document.getElementById('feedback');

$('form#submit-message').on('submit', function(e){
    if(message.value != "" && message.value.trim() != ""){
        var today = new Date();
        var timestamp = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + " " + today.getHours() + ':'+today.getMinutes()+':'+today.getSeconds();
        
        e.preventDefault();
        
        // add to DB
        $.ajax({
            type: 'POST',
            url: '/message',
            data: {message: message.value, user_id: user_id.value},
            success: function(data){
                if (data == "success") {
                    // emit 'chat' to server (app.js)
                    socket.emit('chat', {
                        message: message.value,
                        timestamp: String(timestamp),
                        user_id: user_id.value
                    });

                    message.value = ""
                    message.style.border = "1px solid #d2dae2"
                }
            }
        });
    }
    else  {
        e.preventDefault();
        message.style.border = "1px solid #ff4d4d"
    }

});

// emit to app.js
message.addEventListener('focusin', function(){
    socket.emit('typing', display_name.value);
})
message.addEventListener('keypress', function(){
    socket.emit('typing', display_name.value);
})
message.addEventListener('focusout', function(){
    socket.emit('typing', "");
})

// listen event to app.js
socket.on('chat', function(data){
    feedback.innerHTML = '';

    if (data.user_id == user_id.value) {
        output.innerHTML += '<div class="col-md-12">'+
            '<div class="myUser mb-3" data-toggle="tooltip" data-placement="top" title="'+data.timestamp+'">'+
                data.message +
            '</div>'+
        '</div>'
    }else{
        output.innerHTML +=  '<div class="col-md-12">'+
            '<div class="friends mb-3" data-toggle="tooltip" data-placement="top" title="'+data.timestamp+'">'+
                data.message +
            '</div>'+
        '</div>'
    }
   
    // auto scroll bottom
    $("#content-message").animate({ scrollTop: $('#content-message').prop("scrollHeight")}, 1000);
});
socket.on('typing', function(data){
    if(data == ""){
        feedback.innerHTML = '';
    }else{
        feedback.innerHTML = '<p><em>' + data + ' đang soạn tin...</em></p>';
    }
});

