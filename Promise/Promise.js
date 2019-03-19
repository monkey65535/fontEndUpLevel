const Promise = require('./myPromise')
const P = new Promise(function (reslove, reject) {
    reslove('first Reslove')
});
let Promise2 = P.then(data => {
    console.log(data);  
    return Promise2;
}).then(res => {
    console.log(data);
}, err => {
    console.log(err);
})