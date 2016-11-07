class Scraper {
  constructor(options) {
    this.source = options.source || '';
    this.baseUrl = options.baseUrl || '';
    this.searchTerm = options.searchTerm || '';
    this.numItems2Scrape = options.numItems2Scrape || -1;

    this.numItemsScraped = 0;
    this.numPagesScraped = 0;
    this.servers = [];
    this.delayTimeArr = [300, 800];
  }

  setDelayTime(min, max) {
    this.delayTimeArr[0] = min || this.delayTimeArr[0];
    this.delayTimeArr[1] = max || this.delayTimeArr[1];
  }

  getDelayTime() {
    return (Math.random() * (this.delayTimeArr[1] - this.delayTimeArr[0])) + this.delayTimeArr[0];
  }

  isDone() {
    return (this.numItemsScraped >= this.numItems2Scrape && this.numItems2Scrape !== -1);
  }
}


module.exports = Scraper;
