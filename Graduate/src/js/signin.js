$(function () {
    $('[href="#signup"]').bind('click', function () {
        $('.navs-slider').attr('data-active-index', 0);
        $('a').removeClass('active');
        $('[href="#signup"]').addClass('active');
        $('.view-signin').css('display', 'none');
        $('.view-signup').css('display', 'block');
    });
    $('[href="#signin"]').bind('click', function () {
        $('.navs-slider').attr('data-active-index', 1);
        $('a').removeClass('active');
        $('[href="#signin"]').addClass('active');
        $('.view-signin').css('display', 'block');
        $('.view-signup').css('display', 'none');
    });



});
var matchEmail = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
function checkSignupForm() {
    var email = $('#inputEmailup').val();
    var password = $('#inputPasswordup').val();
    if (!matchEmail.exec(email)) {
        alert('请输入正确的邮箱账号！');
        return;
    }
    else if (password.length < 6) {
        alert('请输入6位以上密码！');
        return;
    }
    else if (matchEmail.exec(email) && password.length >= 6) {
        $.ajax({
            type: "get",
            url: "/api/users/getUserByParam?key=username&value=" + email,
            async: false,
            success: function (data) {
                if (data.length == 0) {
                    $.ajax({
                        type: "get",
                        url: "/api/users/addUser?username=" + email + "&password=" + password,
                        async: false,
                        success: function (data) {
                            if (data.code == 200) {
                                alert('注册成功！请登录！');
                                $('#inputEmailup').val('');
                                $('#inputPasswordup').val('');
                                $('.navs-slider').attr('data-active-index', 1);
                                $('a').removeClass('active');
                                $('[href="#signin"]').addClass('active');
                                $('.view-signin').css('display', 'block');
                                $('.view-signup').css('display', 'none');
                            }
                            else {
                                alert('注册失败！');
                                $('#inputEmailup').val('');
                                $('#inputPasswordup').val('');
                            }
                        }
                    });
                }
                else {
                    $('#inputEmailup').val('');
                    $('#inputPasswordup').val('');
                    $('.navs-slider').attr('data-active-index', 1);
                    $('a').removeClass('active');
                    $('[href="#signin"]').addClass('active');
                    $('.view-signin').css('display', 'block');
                    $('.view-signup').css('display', 'none');
                    alert("该邮箱已经注册，请直接登录！");
                }
            }
        });
    }

}
function checkSigninForm() {
    var email = $('#inputEmailin').val();
    var password = $('#inputPasswordin').val();
    if (!matchEmail.exec(email)) {
        alert('请输入正确的邮箱账号！');
    }
    if (matchEmail.exec(email) && password.length > 0) {
        $.ajax({
            type: "get",
            url: "/api/users/getUserByParam?key=username&value=" + email,
            async: false,
            success: function (data) {
                if (data.length != 0) {
                    if (data[0].password == password) {
                        $('#inputEmailin').val('');
                        $('#inputPasswordin').val('');
                        alert("登录成功!");
                        window.location.href="../index.html";
                    }
                    else {
                        $('#inputPasswordin').val('');
                        alert("密码错误!");
                    }
                }
                else {
                    $('#inputEmailin').val('');
                    $('#inputPasswordin').val('');
                    alert("该邮箱未注册!");
                }

            }
        });
    }
}