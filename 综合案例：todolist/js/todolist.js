$(function () {
    // -------------------------- 😍 封装函数saveData()：设置本地存储数据，传入对象 --------------------------
    function saveData(obj) {
        localStorage.setItem('todo', JSON.stringify(obj)); // 对象必须转换为字符串 
    }
    // -------------------------- 😍 封装函数 getData()：读取本地存储的数据，返回数组 --------------------------
    function getData() {
        let str = localStorage.getItem('todo');
        if (str !== null) {
            let arr = JSON.parse(str); // 本地存储里面的数据是字符串，我们需要对象格式，JSON.parse(str)
            return arr;
        } else {
            return [];
        }
    }
    // -------------------------- 😍 封装函数 load()：本地存储数据渲染到页面中 --------------------------
    function load() {
        let arr = getData(); // 获取本地数据：数组
        let doingNum = 0; // 存储正在进行事项数量
        let doneNum = 0; // 存储已经完成事项数量

        $('.doing,.done').html(''); // 每次渲染遍历之前，都要先清空.doing和.done的内容

        $.each(arr, function (i, ele) { // 遍历数组,每次都创建一个li
            var li = $('<li></li>'); // 创建li
            $(li).attr('index', i) // 每次渲染都会对li添加自定义属性 index ，值为i，方便后期找出被点击li是哪一个

            $(li).append('<input type="checkbox" name="" id="" class="ok">'); // 往li中添加子元素
            $(li).append('<input type="text" class="txt">'); // 往li中添加子元素
            $(li).append('<span class="time"></span>') // 往li中添加子元素
            $(li).append('<a href="javascript:;" class="del">&#xe604;</a>'); // 往li中添加子元素

            $(li).children('.txt').val(ele.title); // 对li中的文本框value属性赋值
            $(li).children('.ok').prop('checked', ele.done) // 对li中的复选框checked属性赋值
            $(li).children('.time').html(ele.time) // 对li中的.time盒子文本赋值

            if ($(li).children('.ok').prop('checked')) { // 根据li的复选框checked属性，判断是加到.done还是.doing
                $('.done').prepend(li);
                $(li).fadeIn(function () { // 动画淡入
                    $(this).show();
                })
                doneNum++;
            } else {
                $('.doing').prepend(li);
                $(li).fadeIn(function () { // 动画淡入
                    $(this).show();
                })
                doingNum++;
            }
        })

        $('.doing-num').html(doingNum); // 还要将doing右边小泡泡里的数字渲染
        $('.done-num').html(doneNum); // 还要将done右边小泡泡里的数字渲染
    }

    // -------------------------- 😍 封装函数 getNowTime()：获取当前时间（年-月-日 时:分） --------------------------

    function getNowTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 月份+1
        var dates = date.getDate();
        var days = date.getDay();
        var daysArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ] //周日必须写在最前面
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;

        var myTime = year + '-' + month + '-' + dates + ' ' + h + ':' + m;
        return myTime;
    }

    // --------------------------⛄ 功能:页面加载完毕就马上渲染一次本地存储到页面中 ⛄--------------------------
    load();

    // --------------------------🙉 事件：按下回车(CR的ASCII值=13) 🙉--------------------------
    $('.add-list').on('keyup', function (e) {
        // --------------------------⛄ 功能：输入不能为空 ⛄--------------------------
        if (!$(this).val()) {
            alert('请输入内容后提交！')
            return false;
        }
        // --------------------------⛄ 功能：把新数据添加到本地存储中 ⛄--------------------------
        if (e.keyCode == 13) {
            var arr = getData(); // 先读取本地存储原来的数组数据
            arr.push({ // 把新的数据追加给arr数组，push()
                title: $(this).val(), // title保存用户输入内容
                time: getNowTime(),
                done: false, // 刚输入的，肯定是正在进行的
            });
            saveData(arr); // 重新本地存储

            // --------------------------⛄ 功能：将本地存储数据渲染到加载页面中 ⛄--------------------------
            load();

            // --------------------------⛄ 功能：操作完成后，清空用户输入 ⛄--------------------------
            $(this).val('');
        }
    })


    // --------------------------🙉 事件：点击删除,删除是动态元素,使用事件处理on() 🙉--------------------------
    $('.doing,.done').on('click', '.del', function () {
        // --------------------------⛄ 功能：被点击的数据从本地存储中删除(实际上是从数组中删除指定元素) ⛄--------------------------
        let arr = getData(); // 获取本地数据：数组
        let index = $(this).parent().attr('index') // 获取被点击li的自定义索引号
        arr.splice(index, 1); // 根据索引号，从数组中删除指定元素：splice(开始索引，删除个数)
        saveData(arr); // 回传数据到本地存储
        load(); // 重新渲染页面
    })

    // --------------------------🙉 事件：.doing和.done 添加 change事件委托，复选框是动态元素,使用事件处理on() 🙉--------------------------
    $(".doing,.done").on('change', '.ok', function () {
        // --------------------------⛄ 功能：点击复选框后，让arr数据中对应的done数据取反 ⛄--------------------------
        let arr = getData(); // 获取本地数据，数组
        let index = $(this).parent().attr('index') // 获取点击复选框所在li的自定义索引号index
        arr[index].done = $(this).prop('checked'); // function()是回调函数！此时的checked属性是已经取反了的
        saveData(arr);
        load();
    })

    // --------------------------🙉 事件：.doing和.done 添加change和blur事件委托，复选框是动态元素,使用事件处理on() 🙉--------------------------
    $('.doing,.done').on('change blur', '.txt', function () {
        // --------------------------⛄ 功能：修改.txt 文本框的value属性，然后重新渲染 ⛄--------------------------
        let arr = getData(); // 获取本地数据，数组
        let index = $(this).parent().attr('index'); // 获取被修改文本框所在li的自定义属性index
        arr[index].title = $(this).val(); // 数组arr修改指定索引index的元素的title属性
        saveData(arr);
        load();
        // --------------------------⛄ 功能：.txt 文本框改变后，移除类名，失去边框 ⛄--------------------------
        $(this).removeClass('current');
    })


    // --------------------------🙉 事件：.doing和.done 添加focus事件委托，复选框是动态元素,使用事件处理on() 🙉--------------------------
    $('.doing,.done').on('focus', '.txt', function () {
        // --------------------------⛄ 功能：.txt文本框获得焦点时，添加类名，获得边框 ⛄--------------------------
        $(this).addClass('current'); // 添加类名：含边框样式
    })
})