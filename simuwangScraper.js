const Scraper = require('./Scraper');
const request = require('./common/superagent');
const fs = require('fs');
const url = require('url');
const Promise = require('bluebird');


class SimuwangScraper extends Scraper {
  constructor(searchTerm, pageTerm) {
    super({
      baseUrl: 'http://dc.simuwang.com/Ranking/get.html?page=1&condition=ret%3A10%3Bstrategy%3A1%3Bfund_type%3A1%2C6%2C4%2C3%2C8%2C2%3Bistiered%3A0%3Bsort_name%3Aprofit_col1%3Bsort_asc%3Adesc%3Bkeyword%3Aundefined%3B&pos=',
      source: 'simuwang'
    });

    this.searchTerm = searchTerm;
    this.pageTerm = pageTerm;
    this.currentUrl = [];
    this.currentUrlIndex = 1;
    this.urlSegmentArr = [
      this.baseUrl,
    ];
    this.urlQuene = [];
    this.next = null;
  }

  getInitialSearchPageUrl() {
    // TODO : 这里我需要对url进行处理，包括待爬取的第一层页面url 和 url对应的url内容
    this.currentUrl.push('http://dc.simuwang.com/Ranking/get.html?page=' + this.pageTerm + '&condition=ret%3A10%3Bstrategy%3A1%3Bfund_type%3A1%2C6%2C4%2C3%2C8%2C2%3Bistiered%3A0%3Bsort_name%3Aprofit_col1%3Bsort_asc%3Adesc%3Bkeyword%3Aundefined%3B&pos=');
    return this.currentUrl;
  }

  scrape() {
    this.collect(this.getInitialSearchPageUrl());
  }

  collect(url) {
    let id = [];

    if (!url) {
      return false;
    }

    Promise.mapSeries(url, async(item, index, length) => {
      try {
        console.log('this thing start');

        var res = await request.getDelay(item, index * length * 10);

        const resultArr = JSON.parse(res.text).data;

        for (let result of resultArr) {
          id.push(result.fund_id);
        }

        var ws = fs.createWriteStream(`page${this.pageTerm}.xlsx`);

        var length2 = 0;
        for (let i = 0; i < id.length; i++) {
          var res2 = await request.getDelay(`http://dc.simuwang.com/index.php?m=Data&c=Chart&a=jzdb_stock&fund_id=${id[i]}`, i * id.length * 10);

          length2 += JSON.parse(res2.text).data['0'].length;
          this.setExcel(res2, ws);
          console.log(length2);
        }
      } catch (err) {
        console.log(err);
        console.error('Unable to retrieve the target url.');
      }
    });
  }

  getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
  }

  setExcel(res, ws) {
    var title = JSON.parse(res.text).title;
    var value1 = JSON.parse(res.text).data['0'];
    var value2 = JSON.parse(res.text).data['1'];
    var value3 = JSON.parse(res.text).data['2'];
    for (let i = 0; i < value1.length; i++) {
      var data = title + '\t' + this.getLocalTime(value1[i][0] / 1000) + '\t' + value1[i][1] + '\t' + this.getLocalTime(value2[i][0] / 1000) + '\t' + value2[i][1] + '\t' + this.getLocalTime(value3[i][0] / 1000) + '\t' + value3[i][1] + '\n';
      ws.write(data);
    }
  }
}

module.exports = SimuwangScraper;
