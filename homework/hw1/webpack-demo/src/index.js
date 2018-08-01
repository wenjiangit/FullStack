
import _ from 'lodash';

import add ,{test} from './mode1.js';


console.log(add)

function component() {
    var element = document.createElement('div');
  
    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
    return element;
  }
  
  document.body.appendChild(component());


let ret = add(20,30)

alert(ret)

test().then((res)=>{
    console.log(res)
})


