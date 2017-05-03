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

    //获取窗口宽高		
    var w = window.innerWidth;
    var h = window.innerHeight;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    //设置画布宽高与窗口宽高一样		
    canvas.width = w;
    canvas.height = h;
    //随机数函数		
    function fnRandom(min, max) {
        return parseInt((max - min) * Math.random() + min + 1)
    }
    function Round() {

        this.r = fnRandom(3, 10);
        this.diam = this.r * 2;
        //随机位置			
        var x = fnRandom(0, canvas.width - this.r);
        this.x = x < this.r ? this.r : x;
        var y = fnRandom(0, canvas.height - this.r);
        this.y = y < this.r ? this.r : y
        //随机速度			
        var speed = fnRandom(2, 4) / 10
        this.speedX = fnRandom(0, 4) > 2 ? speed : -speed;
        this.speedY = fnRandom(0, 4) > 2 ? speed : -speed;
        //颜色			
        this.color = "#eceeef";
    }
    Round.prototype.draw = function () {

        //绘制函数			
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    Round.prototype.move = function () {
        this.x += this.speedX;
        if (this.x > canvas.width - this.r) {//				
            this.speedX *= -1;
            this.x = this.r
        } else if (this.x < this.r) {
            this.x = canvas.width - this.r
        }
        this.y += this.speedY;
        if (this.y > canvas.height - this.r) {//				
            this.speedY *= -1;
            this.y = this.r
        } else if (this.y < this.r) {
            this.y = canvas.height - this.r
        }
    }
    //使用Round		
    var allRound = [];
    function initRound() {
        //初始化30个圆形对象,放到数组中			
        for (var i = 0; i < 60; i++) {
            var obj = new Round();
            obj.draw();
            obj.move();
            allRound.push(obj);
        }
    }
    initRound();
    var dxdy = []
    function roundMove() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //遍历所有的圆形对象,让对象自己重绘,移动			
        for (var i = 0; i < allRound.length; i++) {
            var round = allRound[i];
            round.draw();
            round.move();
            dxdy[i] = {
                dx: round.x,
                dy: round.y
            };
            var dx = dxdy[i].dx;
            var dy = dxdy[i].dy;
            for (var j = 0; j < i; j++) {
                var sx = dxdy[j].dx;
                var sy = dxdy[j].dy;
                l = Math.sqrt((dx - sx) * (dx - sx) + (dy - sy) * (dy - sy));
                var C = 1 / l * 7 - 0.009;
                var o = C > 0.03 ? 0.03 : C;
                ctx.strokeStyle = 'rgba(0,0,0,' + o + ')'
                ctx.beginPath()
                ctx.lineWidth = .5;
                ctx.moveTo(dxdy[i].dx, dxdy[i].dy)
                ctx.lineTo(dxdy[j].dx, dxdy[j].dy);
                ctx.closePath()
                ctx.stroke()
            }
        }
        window.requestAnimationFrame(roundMove)
    }
    roundMove();
});
/**
 * 登录版块滑动
 */
function signinBlock() {
    $('.navs-slider').attr('data-active-index', 1);
    $('a').removeClass('active');
    $('[href="#signin"]').addClass('active');
    $('.view-signin').css('display', 'block');
    $('.view-signup').css('display', 'none');
}
var matchEmail = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
function checkSignupForm() {
    $('.alert').css('display','none');
    var email = $('#inputEmailup').val();
    var password = $('#inputPasswordup').val();
    if (!matchEmail.exec(email)) {
        console.log('请输入正确的邮箱账号！');
        $('.errEmail').css('display','block');
        return;
    }
    else if (password.length < 6) {
        console.log('请输入6位以上密码！');
        $('.errPwdShort').css('display','block');
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
                                console.log('注册成功！请通知管理员审核！');
                                $('.signupSuc').css('display','block');
                                $('#inputEmailup').val('');
                                $('#inputPasswordup').val('');
                                signinBlock();
                            }
                            else {
                                console.log('注册失败！');
                                $('.errSignup').css('display','block');
                                $('#inputEmailup').val('');
                                $('#inputPasswordup').val('');
                            }
                        }
                    });
                }
                else {
                    $('#inputEmailup').val('');
                    $('#inputPasswordup').val('');
                    signinBlock();
                    console.log("该邮箱已经注册，请直接登录！");
                    $('.errAlready').css('display','block');
                }
            }
        });
    }

}
function checkSigninForm() {
    $('.alert').css('display','none');
    var email = $('#inputEmailin').val();
    var password = $('#inputPasswordin').val();
    if (!matchEmail.exec(email)) {
        console.log('请输入正确的邮箱账号！');
        $('.errEmail').css('display','block');
         return;
    }
    if (matchEmail.exec(email) && password.length > 0) {
        $.ajax({
            type: "get",
            url: "/api/users/getUserByParam?key=username&value=" + email,
            async: false,
            success: function (data) {
                if (data.length != 0) {
                    if (data[0].flag == 0) {
                        signinBlock();
                        $('#inputEmailin').val('');
                        $('#inputPasswordin').val('');
                       console.log("该账户还未审核通过，请通知管理员!");
                       $('.errWait').css('display','block');
                    }
                    else {
                        if (data[0].password == password) {
                            $('.signinSuc').css('display','block');
                            window.location.href = "/index.html";
                            $('#inputEmailin').val('');
                            $('#inputPasswordin').val('');
                            sessionStorage.removeItem('user');
                            sessionStorage.setItem('user', email);
                            localStorage.removeItem('flag');
                            localStorage.setItem('flag', data[0].flag);

                        }
                        else {
                            signinBlock();
                            $('#inputPasswordin').val('');
                            console.log("密码错误!");
                            $('.errPwd').css('display','block');
                        }
                    }
                }
                else {
                    signinBlock();
                    $('#inputEmailin').val('');
                    $('#inputPasswordin').val('');
                    console.log("该邮箱未注册!");
                    $('.errNever').css('display','block');
                }

            }
        });
    }
}
