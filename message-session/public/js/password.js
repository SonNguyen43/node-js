$('#formChangePassword').on('submit', function(e){
    if($('#oldPassword').val() != "" && $('#oldPassword').val().trim() != ""
        && $('#newPassword').val() != "" && $('#newPassword').val().trim() != ""
        && $('#confirmPassword').val() != "" && $('#confirmPassword').val().trim() != ""){

        e.preventDefault();

        if ($('#newPassword').val() == $('#confirmPassword').val()) {
            $.ajax({
                type: 'POST',
                url: '/changePassword',
                data: {oldPassword: $('#oldPassword').val(), newPassword: $('#newPassword').val(), email: $('#email').val()},
                success: function(data){
                    if(data.result == 'Thay đổi thành công !'){
                        Swal.fire({ icon: 'success', title: 'Thông báo', text: data.result})
                    }else{
                        Swal.fire({ icon: 'warning', title: 'Thông báo', text: data.result})
                    }
                  
                }
            });
        }else{
            Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Mật khẩu không giống nhau !'})
        }
    }else{
        e.preventDefault();
       
        Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Vui lòng sử dụng thông tin hợp lệ !'})
    }
});