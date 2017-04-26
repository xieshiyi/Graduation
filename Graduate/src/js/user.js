$(function () {
    function initUserInfo() {
        var result = [];
        $.ajax({
            type: "get",
            url: "/api/users",
            async: false,
            success: function (data) {
                result = data;
            }
        });
        return result;
    }
    function initAllUserCount() {
        var result = 0;
        $.ajax({
            type: "get",
            url: "/api/users/getAllUserCount",
            async: false,
            success: function (data) {
                result = data[0].flagCount;
            }
        });
        return result;
    }
    function initUserCount(flag) {
        var result = 0;
        $.ajax({
            type: "get",
            url: "/api/users/getUserCountByParam?flag=" + flag,
            async: false,
            success: function (data) {
                result = data[0].flagCount;
            }
        });
        return result;
    }
    /**
* 删除信息确认
*/
    function delete_confirm() {

        if (window.confirm('删除是不可恢复的，你确认要删除吗？')) {
            //alert("确定");
            return true;
        } else {
            //alert("取消");
            return false;
        }
    }
    /**
         * 用户信息的删除和审核
         */
    function deleteUser(id) {
        if (delete_confirm()) {
            $.ajax({
                type: "get",
                url: "/api/users/deleteUser?id=" + id,
                async: false,
                success: function (data) {
                    if (data.code == 200) {
                        alert('删除成功！');
                        $('.all').html(initAllUserCount());
                        $('.already').html(initUserCount(1));
                        $('.never').html(initUserCount(0));
                        insertToUserList(initUserInfo());
                        insertToUserList(getUserInfoByParam(1));
                        insertToUserList(getUserInfoByParam(0));
                    }
                    else {
                        alert('删除失败！');
                    }
                }
            });
        }
    }
    function check_confirm() {
        if (window.confirm('确认审核通过该用户吗？')) {
            //alert("确定");
            return true;
        } else {
            //alert("取消");
            return false;
        }
    }
    function checkUser(id) {
        if (check_confirm()) {
            $.ajax({
                type: "get",
                url: "/api/users/updateUserFlag?id=" + id,
                async: false,
                success: function (data) {
                    if (data.code == 200) {
                        alert('审核通过！');
                        $('.all').html(initAllUserCount());
                        $('.already').html(initUserCount(1));
                        $('.never').html(initUserCount(0));
                        insertToUserList(initUserInfo());
                        insertToUserList(getUserInfoByParam(1));
                        insertToUserList(getUserInfoByParam(0));
                    }
                    else {
                        alert('审核失败！');
                    }
                }
            });
        }
    }
});