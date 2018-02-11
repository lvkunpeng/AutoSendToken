var fs = require("fs");
const path = require("path");
const index = require('./index');
fs.readFile(path.resolve(__dirname,'./candy.csv'), function (err, data) {
    var table = new Array();
    if (err) {
        console.log(err.stack);
        return;
    }
    ConvertToTable(data, function (table) {
        top(table)
    })
});
console.log("列表遍历完毕！");



function ConvertToTable(data, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    rows = data.split("\n");
    // console.log(rows)
    for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
    }
    callBack(table);
}

async function top(table){
    // for(let i = 0;i<table.length;i++){
    //     console.log(table[i][i],table[i][1])
       
    // }
    let i;
    for (i = 0; i < table.length; i++) {
      try {
        console.log(`发送地址为：${table[i][0]}，发送币数为：${table[i][1]}`)
        await index(table[i][0],table[i][1]*Math.pow(10,18))
        console.log("&&&&&&&&&&&&&&&&&打包下一个条交易&&&&&&&&&&&&&&&&&&&")
        // break;
      } catch(err) {}
    }
}