const mysql = require('mysql');
const inquirer = require('inquirer');
var total = 0;

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

// display bamazons inventory and product details
function showItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("\nProduct: " + res[i].product_name + "\n" +
        "Department: " + res[i].department_name + "\n" +
        "Price: $" + res[i].price + "\n" +
        "Stock: " + res[i].stock_quantity);
      console.log("\n----------------------------------------\n");
    }
    buyItem();
  });

};

// user selects which item to buy and how many
function buyItem() {
  connection.query("SELECT * FROM products", function (err, res) {
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
    },
    {
      name: "quantity",
      message: "How many would you like to purchase?"
    }
    ]).then(function (answer) {

      if (err) throw err;

      // 
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].product_name === answer.item) {
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
          function (err) {
            if (err) throw err;

            // update shoppers total
            total += parseInt(answer.quantity) * (chosenItem.price).toFixed(2);
            // display shoppers total
            console.log("Your total is $" + total);

            continueShopping();
          }
        )
      }
      else {
        console.log("We're sorry. We don't have enough in stock.");

        continueShopping();
      }
    })
  });
}

// give the customer an option to keep shopping or exit the program
function continueShopping() {
  inquirer.prompt([{
    name: 'answer',
    type: 'list',
    choices: ['yes', 'no'],
    message: 'Would you like to continue shopping?',
  }
  ]).then(function (answer) {

    if (answer.answer == 'yes') {
      showItems();
    }
    else {
      process.exit(0);
    }
  })
}

// use this to refill select stock quantities by ite id
// connection.query(
//   "UPDATE products SET ? WHERE ?",
//   [
//     {
//       stock_quantity: 15
//     },
//     {
//       item_id: 1
//     }
//   ],
//   function (err) {
//     if (err) throw err;
//     //console.log("Thank you for your business! Your total is " + "$" + parseInt(answer.quantity) * chosenItem.price);
//   }
// );
