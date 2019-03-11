const Promise = require('./myPromise')
const P = new Promise(function (reslove, reject) {
    console.log('start Promise');
    reslove('start')
})
P.then(function (value) {
    console.log(value)
}, function (reason) {
    console.log(reason);
})