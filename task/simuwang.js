/**
 * Created by Rain on 2016/11/4.
 */
var Analysis = require('../analysis/getUrlDate');
var SaveToExcel = require('../save/saveToExcel');

var baseUrl = 'http://dc.simuwang.com/Ranking/get.html?page=1&condition=ret%3A10%3Bstrategy%3A1%3Bfund_type%3A1%2C6%2C4%2C3%2C8%2C2%3Bistiered%3A0%3Bsort_name%3Aprofit_col1%3Bsort_asc%3Adesc%3Bkeyword%3Aundefined%3B&pos=';

async function simuwangTask(pageNumber) {
  var currentUrl = `http://dc.simuwang.com/Ranking/get.html?page=${pageNumber}&condition=ret%3A10%3Bstrategy%3A1%3Bfund_type%3A1%2C6%2C4%2C3%2C8%2C2%3Bistiered%3A0%3Bsort_name%3Aprofit_col1%3Bsort_asc%3Adesc%3Bkeyword%3Aundefined%3B&pos=`;

  var ids = await getIds(currentUrl);

  var result = [];
  for (let i = 0; i < ids.length; i++) {
    var url = `http://dc.simuwang.com/index.php?m=Data&c=Chart&a=jzdb_stock&fund_id=${ids[i]}`;

    var rs = await Analysis.getData(url);
    result.push(rs);
  }

  result.forEach(function (rs) {
    SaveToExcel.save(pickData(rs), `page${pageNumber}.xlsx`);
  });
}

async function getIds(currentUrl) {
  var temp = await Analysis.getData(currentUrl);
  temp = JSON.parse(temp);
  var ids = [];
  temp.data.forEach((result)=> {
    ids.push(result.fund_id);
  });
  return ids;
}

function pickData(res) {
  try {
    var title = JSON.parse(res).title;
    var value1 = JSON.parse(res).data['0'];
    var value2 = JSON.parse(res).data['1'];
    var value3 = JSON.parse(res).data['2'];

    var result = [];
    for (let i = 0; i < value1.length; i++) {
      result.push(title + '\t' + getLocalTime(value1[i][0] / 1000) + '\t' + value1[i][1] + '\t' + getLocalTime(value2[i][0] / 1000) + '\t' + value2[i][1] + '\t' + getLocalTime(value3[i][0] / 1000) + '\t' + value3[i][1] + '\n')
    }

    return result;
  } catch (err) {
    console.err('pickData' + err);
  }
}

function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}


module.exports = {simuwangTask};





