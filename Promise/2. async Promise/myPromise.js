// 简单的实现一个自己的Promise
// Promise 接收一个exectuor
// exectuor中有两个参数，分别为reslove和reject
const PEDDING = 'PEDDING';
const RESLOVED = 'RESLOVED';
const REJECTED = 'REJECTED';

function Promise(exectuor) {
    const _this = this;
    // 首先设置state为pedding 
    _this.state = PEDDING;
    _this.value = null;
    _this.reason = null;
    _this.onFulfilledCallbackFn = [];
    _this.onRejectedCallbackFn = [];
    if (typeof exectuor !== 'function') {
        throw new Error('Promise必须接收一个函数为参数')
        return false;
    }
    // 定义函数reslove 和函数reject
    function reslove(value) {
        debugger
        // 状态不可逆
        if (_this.state === PEDDING) {
            _this.value = value;
            _this.state = RESLOVED;
            _this.onFulfilledCallbackFn.forEach(fn => fn())
        }
    }

    function reject(reason) {
        // 状态不可逆
        if (_this.state === PEDDING) {
            _this.reason = reason;
            _this.state = RESLOVED;
            _this.onRejectedCallbackFn.forEach(fn => fn())
        }
    }

    // 执行函数exectuor
    exectuor(reslove, reject)
}
Promise.prototype.then = function (onFulfilled, onRejected) {

    const _this = this;
    // console.log('then')
    // 当state为RESLOVED
    if (_this.state === RESLOVED) {
        // 传递数值返回到函数中
        onFulfilled(_this.value)
    }
    // 当state 为 REJECTED
    if (_this.state === REJECTED) {
        // 传递数值返回到函数中
        onRejected(_this.reason)
    }
    // 当state尚未转化状态时
    if (_this.state === PEDDING) {
        // 将对应函数push进数组等待调用
        _this.onFulfilledCallbackFn.push(() => {
            onFulfilled(_this.value)
        });
        _this.onRejectedCallbackFn.push(() => {
            onRejected(_this.reason)
        });
    }
}
module.exports = Promise;