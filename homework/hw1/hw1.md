## 1.分析Generator-runner实现细节?

安装``yield-runner-blue ``

```shell
$ cnpm install yield-runner-blue 
```

```javascript
function run(_gen) {

    return new Promise((resolve, reject) => {
        //获取generator对象
        let gen = _gen()

        //开始执行到第一个yield关键字
        _next()

        function _next(last_res) {

            //执行next函数,并传递上一步的参数
            let tempRes = gen.next(last_res);

            //如果没有执行完毕
            if (!tempRes.done) {
                let obj = tempRes.value
                if (obj instanceof Promise) {
                    obj.then(res => {
                        _next(res)
                    }, err => {
                        reject(err)
                    })
                } else if (obj instanceof Function) {
                    //如果操作返回的是generator对象
                    if (obj.constructor.toString().startsWith('function GeneratorFunction()')) {
                        run(obj).then(res => _next(res), reject)
                    } else {
                        //执行下一个next方法
                        _next(obj())
                    }
                } else {
                    _next(obj)
                }
            } else {
                resolve(tempRes.value)
            }
        }
    })

}

//测试

function add(x, y) {
    return x + y
}

run(function* () {

    console.log('start...')

    let a = yield aaa()   //一个异步操作

    let b = yield add(10, 30)   //一个同步操作

    return a + b
}).then(res => {
    console.log(res)
})
```
其实还是依赖``Generator``函数本身的实现,然后内部调用其``next``函数,将整个流程串起来

配合``Promise``,则可以实现以同步方式书写异步代码

而``ES7``中``async/await``则是官方对``generator``函数的一个``run``实现

上面的例子写成ES7的形式如下:

```javascript

async function run_es7(){

    let a = await aaa()

    let b = await aaa()

    return a+b

}

run_es7().then(res=>{
    console.log(res)
})

```

---

## 2.什么是AMD,CMD?

### AMD

> 异步模块定义规范

[官方文档](https://github.com/amdjs/amdjs-api/wiki/AMD-%E4%B8%AD%E6%96%87%E7%89%88)

``AMD ``是 ``RequireJS ``在推广过程中对模块定义的规范化产出。

这样模块和模块的依赖可以被异步加载。这和浏览器的异步加载模块的环境刚好适应（浏览器同步加载模块会导致性能、可用性、调试和跨域访问等问题）。

``AMD`` 的诞生，就是为了解决这两个问题：

1. 实现`` js`` 文件的异步加载，避免网页失去响应
2. 管理模块之间的依赖性，便于代码的编写和维护

``AMD``(异步模块定义)主要为前端 ``JS`` 的表现指定规范。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

``AMD`` 也采用 [require()](https://github.com/amdjs/amdjs-api/wiki/require) 语句加载模块，但是不同于`` CommonJS``，它要求两个参数：

```javascript
require([module], callback);
```

第一个参数``[module]``，是一个数组，里面的成员就是要加载的模块；第二个参数 ``callback``，则是加载成功之后的回调函数：

```javascript
require(['math'], function (math) {
  math.add(2, 3);
});
```

实现 ``AMD`` 规范的加载器其实是挺多的，目前，主要有两个`` Javascript`` 库实现了`` AMD ``规范：[require.js](https://github.com/requirejs/requirejs) 和 [curl.js](https://github.com/cujojs/curl)。不过多数人还是用 ``require.js ``。


### CMD

> 通用模块定义

[CMD](https://github.com/seajs/seajs/issues/277) 是 [sea.js](https://github.com/seajs/seajs) 在推广过程中对模块定义的规范化产出。 

在 ``CMD ``规范中，一个模块就是一个文件。``define ``是一个全局函数，用来定义模块。
``define`` 接受 ``factory`` 参数，``factory`` 可以是一个函数，也可以是一个对象或字符串。
``factory ``为对象、字符串时，表示模块的接口就是该对象、字符串。比如可以定义一个`` JSON`` 数据模块：

```
define({"foo": "bar"});
```

也可以通过字符串定义模板模块：

```
define('I am a template.My name is {{name}}.');
```

``factory`` 为函数时，表示是模块的构造方法。执行该构造方法，可以得到模块向外提供的接口。
``factory`` 是一个函数，有三个参数，``function(require, exports, module)``
1、``require ``是一个方法，接受模块标识作为唯一参数，用来获取其他模块提供的接口：require(id)
2、``exports`` 是一个对象，用来向外提供模块接口
3、``module`` 是一个对象，上面存储了与当前模块相关联的一些属性和方法

```javascript
define(function(require, exports, module) {
  var a = require('./a');
  a.doSomething();
  // 依赖就近书写，什么时候用到什么时候引入
  var b = require('./b');
  b.doSomething();
});
```

建议写一写 ``SeaJS`` 的 ``CMD ``规范，与 ``AMD ``非常类似，在国内的影响力非常大，但是个人觉得 SeaJS 比 RequireJS 好很多，另外由于是国人开发的，交流也非常方便，可以看到 ``github ``上的更新、互动非常频繁。

### AMD 与CMD的区别

1. 对于依赖的模块，``AMD`` 是**提前执行**，``CMD`` 是**延迟执行**。不过 RequireJS 从2.0开始，也改成了可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 ``as lazy as possible``.
2. CMD 推崇**依赖就近**，AMD 推崇**依赖前置**

[参考](https://neveryu.github.io/2017/03/20/amd-cmd/)