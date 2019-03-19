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
/**
 *定义一个函数reslovePromise来判断返回的X是否是Promise，
 * 如果是Promise，那么让X.then执行，并取执行后的结果传递给Promise2的Reslove方法
 * 如果X是一个常量，那么直接调用Reslove并传递进去
 *
 * @param {class} Promise2
 * @param {any}  x
 * @param {func} reslove
 * @param {func} reject
 */
function reslovePromise(Promise2, x, reslove, reject) {
    if (Promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用了'));
    }
    // 保证X是一个引用类型
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
        // 有可能是Promise
        try {
            // 如果then属性具有getter，那么此时获取属性会抛出异常
            let then = x.then;
            if (typeof then === 'function') {
                // 这个时候的then是一个Promise
                then.call(x, y => {
                    reslove(y);
                }, r => {
                    reject(r);
                })
            } else {
                // 这个时候的then是一个普通的对象
                reslove(x);
            }
        } catch (e) {
            reject(e);
        }

    } else {
        // 普通值直接成功即可
        reslove(x);
    }
}
// Promise 的then方法 需要返回一个新的Promise
Promise.prototype.then = function (onFulfilled, onRejected) {
    const _this = this;
    const Promise2 = new Promise(function (reslove, reject) {
        // 当state为RESLOVED
        if (_this.state === RESLOVED) {
            // 传递数值返回到函数中
            setTimeout(() => {
                // 这里需要使用Promise2，所以需要增加异步来保证函数执行
                try {
                    // 这个X变量不止为常量，也有可能会是一个Promise
                    let x = onFulfilled(_this.value)
                    reslovePromise(Promise2, x, reslove, reject)
                } catch (e) {
                    reject(e) // 如果执行函数时抛出失败，那么会传递给下一个then的失败
                }
            }, 0)


        }
        // 当state 为 REJECTED
        if (_this.state === REJECTED) {
            // 传递数值返回到函数中
            setTimeout(() => {
                try {
                    let x = onRejected(_this.reason)
                    reslovePromise(Promise2, x, reslove, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)

        }
        // 当state尚未转化状态时
        if (_this.state === PEDDING) {
            // 将对应函数push进数组等待调用
            _this.onFulfilledCallbackFn.push(() => {
                setTimeout(() => {
                    // 这里需要使用Promise2，所以需要增加异步来保证函数执行
                    try {
                        // 这个X变量不止为常量，也有可能会是一个Promise
                        let x = onFulfilled(_this.value)
                        reslovePromise(Promise2, x, reslove, reject)
                    } catch (e) {
                        reject(e) // 如果执行函数时抛出失败，那么会传递给下一个then的失败
                    }
                }, 0)
            });
            _this.onRejectedCallbackFn.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(_this.reason)
                        reslovePromise(Promise2, x, reslove, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            });
        }
    })
    return Promise2
}
module.exports = Promise;