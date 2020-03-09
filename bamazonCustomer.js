var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  start();
});

function start() {
  inquirer
    .prompt({
      name: 'item',
      type: 'list',
      message: 'Would you like to buy?',
      choices: function () {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].item_name);
        }
        return choiceArray;
      }
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid === 'POST') {
        postAuction();
      }
      else if (answer.postOrBid === 'BID') {
        bidAuction();
      } else {
        connection.end();
      }
    });
}