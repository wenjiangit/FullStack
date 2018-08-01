// import fs from 'fs';

// let pReadFile = (path) => {
//     return new Promise((resolve, reject) => {
//         fs.readFile(path, 'utf8', (err, data) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data)
//             }
//         })
//     })
// }


export default (x, y) => x + y


export function getAsync(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('异步操作结果')
        },2000)
    })
}


export async function test(){

    console.log('start...')

    let res1 = await getAsync()

    let res2 = await getAsync()

    console.log('end...')

    return res1 + res2

}


// let readFile = async (path) => {

//     let content = await pReadFile(path)

//     console.log(content)

//     return content

// }




