const Promise = require('./myPromise')
const P = new Promise(function (reslove, reject) {
    setTimeout(() => {
        console.log('start Promise');
        reslove('start')
    }, 1200)
})
P.then(function (value) {
    console.log(value)
}, function (reason) {
    console.log(reason);
})