window.onload = function(){
    // 生成所需要的li 为了避免命名冲突使用自执行函数
    (function(){
        // 宽 * 高 * 纵深
        var len = 5 * 5 * 5;

        // 获取 ul 元素
        var oUl = document.getElementById("list").children[0],
            aLi = oUl.children; // 获取所有的li

        // 初始化  li 初始位置
        (function(){
            // for循环 创建len个 li
            for(var i = 0; i < len; i++){
                // 创建 li 标签
                var oLi = document.createElement("li");

                // 给 li 添加属性
                oLi.index = i;
                oLi.x = i % 5;
                oLi.y = Math.floor(i % 25 / 5);
                oLi.z = 4 - Math.floor(i / 25);

                // 给li添加内容    首先获取 data数据
                var data = flyData[i] || flyData[0];

                oLi.innerHTML = "<b class='liCover'></b>" +
                    "            <p class='liTitle'>" + data.type + "</p>" +
                    "            <p class='liAuthor'>" + data.author + "</p>" +
                    "            <p class='liTime'>" + data.time + "</p>";

                // 给 li 添加随机 x y z值
                var rX = Math.random() * 6000 - 3000,  // 在 -3000 到 3000之间
                    rY = Math.random() * 6000 - 3000,
                    rZ = Math.random() * 6000 - 3000;

                // 设置 li 在 3D空间的位置
                oLi.style.transform = " translate3D(" + rX + "px," + rY + "px," + rZ + "px)";

                // 将 li 添加到页面中
                oUl.appendChild(oLi);

                // 让 Li 动起来
                setTimeout(Grid,20);
            }
        })();


        // 拖拽 旋转 滚轮事件
        (function (){
            var roX = 0,
                roY = 0,
                trZ = -2000;
            // 清除字段选中
            document.onselectstart = function(){
                 return false;
            }

            // 鼠标按下事件
            document.onmousedown = function(e){
                // 定义参数
                var downX = e.clientX,
                    downY = e.clientY,
                    lastX = downX,
                    lastY = downY,
                    x_ = 0,
                    y_ = 0,
                    time = 0;

                // 鼠标移动事件
                document.onmousemove = function(e){
                    // 计算移动的值
                    x_ = e.clientX - lastX;
                    y_ = e.clientY - lastY;

                    roX -= y_ * 0.15; // 0.15 为了降低旋转度数
                    roY += x_ * 0.15;

                    oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";

                    // 记录每次移动的值
                    lastX = e.clientX;
                    lastY = e.clientY;

                    // 记录最后移动的时间
                    time = new Date();
                 }

                 // 鼠标抬起事件
                document.onmouseup = function(){
                    document.onmousemove = null;

                    // 计算缓冲
                    function m(){
                        x_ *= 0.9;
                        y_ *= 0.9;

                        roX -= y_ * 0.15;
                        roY += x_ * 0.15;

                        oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";

                        // 判断 x_ 小于0.1时停止
                        if(Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1) return;

                        // 按照浏览器刷新时间执行
                        requestAnimationFrame(m);
                    }
                        // 通过时间 旋转oul
                    if(new Date - time < 100){
                        requestAnimationFrame(m);
                    }
                };

                // 给 Z 轴 添加滚动事件
                (function(fn){
                    // 火狐兼容
                    if(document.onmousewheel === undefined){
                        // 火狐浏览器
                        document.addEventListener("DOMMouseScroll",function(e){
                            var a = -e.detail / 3;
                            fn(a);
                        },false)
                    }else{
                        // 主流浏览器
                        document.onmousewheel = function(e){
                            var a = e.wheelDelta / 120;
                            // 下面注释代码用 回调函数
                            // trZ += a * 66;
                            // oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)"
                            fn(a);
                        }
                    }
                })(function(value){
                    trZ += value * 66;
                    oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)"
                });
            }
        })();


        // 点击 li 弹框
        (function(){

            // 获取元素
            var oAlert = document.getElementById("alert"),
                oTitle = document.getElementsByClassName("title")[0].getElementsByTagName("span")[0],
                oImg = document.getElementsByClassName("img")[0].getElementsByTagName("img")[0],
                oAuthor = document.getElementsByClassName("author")[0].getElementsByTagName("span")[0],
                oInfo = document.getElementsByClassName("info")[0].getElementsByTagName("span")[0],
                oFrame = document.getElementById("frame"),
                oAll = document.getElementById("all"),
                oBrck = document.getElementById("back");

            // var frame = document.getElementById("frame");

            // 用 事件委托 为每个li 注册点击事件
            oUl.onclick = function(e){
                var target = e.target;
                //判断点击的是否是 li 标签上的遮罩 B 标签
                if(e.target.nodeName == "B"){
                //    判断当前是 显示还是 隐藏状态
                    if(oAlert.style.display == "block"){
                        // 当前状态为 显示状态  希望他隐藏
                        hide();
                    }else{
                        // 当前状态为 隐藏状态  希望他显示
                        // 通过index 找到是哪个 li  为他添加对应的数据
                        var index = target.parentNode.index;

                        // 把index存到 oAlert 中  方便弹框点击使用
                        oAlert.index = index;

                        // 获取数据
                        var data = flyData[index] || flyData[0];

                        // 修改内容
                        oTitle.innerHTML = data.title;
                        oImg.src = 'src/' + data.src + '/index.png';
                        oAuthor.innerHTML = "制作人：" + data.author;
                        oInfo.innerHTML = "简述：" + data.dec;

                        show();
                    }
                }
                e.cancelable = true; // 取消事件冒泡
            };

            // 点击弹框 跳转
            oAlert.onclick = function(){
                var data = flyData[this.index] || flyData[0];
                oFrame.src = "src/3D Drag/index.html";
                oAll.className = "left";
                return false;
            };

            // back
            oBrck.onclick = function(){
                oAll.className = "";
            };

            // 点击除了oAlert以外的地方都消失
            document.onclick = function () {
                hide();
            };

            // 弹框显示
            function show(){
                if(!oAlert.timer){
                    oAlert.timer = true;
                    oAlert.style.display = "block"; // 显示

                    oAlert.style.transform = 'rotateY(0deg) scale(2)';// 弹框放大两倍

                    var a = 300,
                        time = new Date();

                    function m(){
                        var temp = (new Date() - time) / a;
                        if(temp >= 1){
                            temp = 1;
                            oAlert.timer = false;
                        }else{
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = 'rotateY(0deg) scale(' + (2 - temp) + ')';
                        oAlert.style.opacity = temp;
                    }
                    requestAnimationFrame(m);
                }
            };

            // 弹框隐藏
            function hide(){
                if(oAlert.style.display == "block" && !oAlert.timer){
                    var a = 300,
                        time = new Date();

                    function m(){
                        var temp = (new Date() - time) / a;
                        if(temp >= 1){
                            temp = 1;
                            oAlert.style.display = "none";
                            oAlert.timer = false;
                        }else{
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = 'rotateY(' + temp * 180 + 'deg) scale(' + (1 - temp) + ')';
                        oAlert.style.opacity = 1 - temp;
                    }
                    requestAnimationFrame(m);
                }
            };

        })();


        // 获取左下角的按钮
        (function(){
            var aBtn = document.getElementById("btn").getElementsByTagName("li");
            aBtn[0].onclick = Table;
            aBtn[1].onclick = Sphere;
            aBtn[2].onclick = Helix;
            aBtn[3].onclick = Grid;

        })();




        //  变成元素周期表样式
        function Table() {
            // 获取一共多少行
            var line = Math.ceil( len / 18) + 2,
                ulX = 18 / 2 - 0.5, // 获取ul X 位置
                ulY = line / 2 - 0.5; // 获取ul Y 位置

            // li 之间的距离
            var disX = 170,
                disY = 210;

            // 定义前 18 个 li 的位置
            var arr = [
                {x:0,y:0},
                {x:17,y:0},
                {x:0,y:1},
                {x:1,y:1},
                {x:12,y:1},
                {x:13,y:1},
                {x:14,y:1},
                {x:15,y:1},
                {x:16,y:1},
                {x:17,y:1},
                {x:0,y:2},
                {x:1,y:2},
                {x:12,y:2},
                {x:13,y:2},
                {x:14,y:2},
                {x:15,y:2},
                {x:16,y:2},
                {x:17,y:2}
            ];

            // for循环遍历  计算每个li 的位置
            for(var i = 0; i < len; i++){
                var x,y;
                if(i < 18){
                    x = arr[i].x;
                    y = arr[i].y;
                }else{
                    x = i % 18;
                    y = Math.floor(i / 18) + 2;
                }
                // 给 li 赋值
                aLi[i].style.transform = 'translate3D(' + (x - ulX) * disX + 'px,' + (y - ulY) * disY + 'px,0px)';
            }
        }


        // 变成球状
        function Sphere(){
            // 确定球面 有多少层 每层多少个li
            var arr = [1, 3, 7, 9, 11, 14, 21, 16, 12, 10, 9, 7, 4, 1],
                arrlen = arr.length,
                xDeg = 180 / (arr.length - 1);

            // 循环 遍历  每个li
            for(var i = 0; i < len; i++){
                // 定义遍历来保存此时的i是球面上的第几层，已经当前层的第几个
                var numC = 0, // 当前第几层
                    numG = 0,  //当前层 第几个
                    arrSum = 0; // 当前层 多少个 li

                // 循环 判断此时的 i 是第几层 第几个
                for(var j = 0; j < arrlen; j++){
                    arrSum += arr[j];
                    // i 是第几层第几个
                    if(arrSum > i){
                        numC = j;
                        numG = arr[j] - (arrSum - i);
                        break;
                    }
                }
                // 根据当前层数求出当前层每一 li y 轴旋转度数
                var yDeg = 360 / arr[numC];

                // 设置li旋转
                aLi[i].style.transform = "rotateY(" + (numG + 1.3) * yDeg + "deg) " + "rotatex(" + (90 - numC * xDeg) + "deg) translateZ(800px)";
            }

        }


        // 变成螺旋状
        function Helix(){

            var h = 3.7, // 确定环数
                tY = 9 ,//上下错位
                num = Math.round(len / h), // 每环多少个li
                deg = 360 / num, // 计算每个 li 旋转度数
                mid = len / 2 - 0.5; // 找中间值

            for(var i = 0; i < len; i++){
                var val = "rotateY(" + i * deg + "deg) translateY(" + (i - mid) * tY + "px) translateZ(800px)";
                aLi[i].style.transform = val
            }

        }


        //  变成网格样式
        function Grid(){
            // 给 li 设置 设置间距
            var disX = 350,
                disY = 350,
                disZ = 800;

            // 循环  计算 每个 li 的位置
            for(var i = 0; i < len; i++){
                var oLi = aLi[i];

                // 获取每个li的 具体位置  -2 是 0的位置在中间
                var x = (oLi.x - 2) * disX,
                    y = (oLi.y - 2) * disY,
                    z = (oLi.z - 2) * disZ;

                oLi.style.transform = "translate3D(" + x + "px," + y + "px," + z + "px)";
            }
        }
    })();

}















