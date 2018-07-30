const runner = require('yield-runner-blue')


// runner(function* () {
//     var a = yield aaa();

//     console.log(`I get a \'${a}\'`);
// });

function aaa() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(12);
        }, 50);
    });
}


function* test() {

    console.log('start...')

    let a = yield aaa()

    let b = yield aaa()

    console.log(a + b)

}


// let gen = test()

// let n1 = gen.next()
// console.log(n1)


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


function add(x, y) {
    return x + y
}

// run(function* () {

//     console.log('start...')

//     let a = yield aaa()   //一个异步操作

//     let b = yield add(10, 30)   //一个同步操作

//     return a + b
// }).then(res => {
//     console.log(res)
// })


async function run_es7(){

    let a = await aaa()

    let b = await aaa()

    return a+b

}

run_es7().then(res=>{
    console.log(res)
})




