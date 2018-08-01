import mode1 from './mode1.js';

let ret = mode1.add(23,21)

console.log(ret)


mode1.readFile('../hw1.js').then(res=>{
    console.log('读取成功')
})


