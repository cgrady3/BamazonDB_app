var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon'
});


// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  showItems();
});

function showItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Product: " + res[i].product_name + "\n" +
        "Department: " + res[i].department_name + "\n" +
        "Price: $" + res[i].price + "\n" +
        "Stock: " + res[i].stock_quantity);
      console.log("----------------------------------------");
    }
    buyItem();
  });

};

function buyItem() {
  inquirer.prompt([{
    name: 'item',
    type: 'list',
    choices: function () {
      var choiceArray = [];
      for (var i = 0; i < res.length; i++) {
        choiceArray.push(res[i].product_name);
      }
      return choiceArray;
    },
    message: 'What would you like to buy?',
  }, {
    name: "quantity",
    message: "How many would you like to purchase?"
  }]).then(function (answer) {

    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;

      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].item_id === answer.item) {
          chosenItem = res[i];
        }
      }

      if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (chosenItem.stock_quantity - parseInt(answer.quantity))
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function (error) {
            if (error) throw error;
            console.log("Thank you for your business! Your total is " + "$" + parseInt(answer.quantity) * chosenItem.price);
          }
        );
      }
      else {
        console.log("We're sorry. We don't have enough in stock.");
      }
    });
  });
};
