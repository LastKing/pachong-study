/**
 * Created by Rain on 2016/11/7.
 */
var fs = require('fs');

function save(data, path) {
  return new Promise((resolve, reject)=> {
    try {
      //方法一 ： fs 打文件追加
      // fs.open(path, 'a', (err, fd) => {
      //   fs.writeSync(fd, data);
      //   console.log(fd);
      // });

      //方法二 ： fs 创建追加流
      var ws = fs.createWriteStream(path, {flags: 'a'});
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        ws.write(data[i]);
      }
      // 标记文件末尾
      ws.end();

      ws.on('finish', function (err) {
        console.log("添加完毕");
        err ? reject(err) : resolve(true);
      });

      //方法三 ：直接使用 追加写入api
      // fs.appendFile(path, data, function () {
      //   console.log("追加完成");
      // })

    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

module.exports = {save};