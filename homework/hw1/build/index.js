'use strict';

var _mode = require('./mode1.js');

var _mode2 = _interopRequireDefault(_mode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ret = _mode2.default.add(23, 21);

console.log(ret);

_mode2.default.readFile('../hw1.js').then(function (res) {
    console.log('读取成功');
});