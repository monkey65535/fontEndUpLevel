const Promise = require('./myPromise')
const P = new Promise(function (reslove, reject) {
    console.log('start Promise');
    setTimeout(() => {
        reslove('start')
    }, 1000)
})
P.then(function (value) {
    console.log(value)
}, function (reason) {
    console.log(reason);
})