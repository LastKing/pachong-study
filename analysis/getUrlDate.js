/**
 * Created by Rain on 2016/11/7.
 */
var request = require('../common/superagent');

async function getData(url) {
  var time = Math.random() * 2000;

  var result = await request.getDelay(url, time);
  return result.text;
}


module.exports = {getData};