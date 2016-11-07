/**
 * Created by Rain on 2016/11/4.
 */
var request = require('superagent');

function get(url) {
  return new Promise((resolve, reject)=> {
    request.get(url)
        .end((err, res)=> {
          err || !res.ok ? reject(err) : resolve(res);
        })
  })
}

function getDelay(url, time) {
  return new Promise((resolve, reject)=> {
    setTimeout(function () {
      request.get(url)
          .end((err, res)=> {
            err || !res.ok ? reject(err) : resolve(res);
          })
    })
  }, time);
}

module.exports = {get, getDelay};