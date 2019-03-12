$(document).ready(function() {
    loadItems();
    displayInputForms();

});

function loadItems() {
    var itemTables = $("#item-table");
    var itemSelector = $("#item-selector");

    $.ajax({
        type: "GET",
        url: " http://tsg-vending.herokuapp.com/items",
        headers: {
            'Content-Type': 'application/json'
          },
          success: function(data) {
              console.log(data);
              $.each(data, function(index, item){
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;
                var id = item.id;
                var index;

                
                var table = "<table onclick='itemSelect(" + item.id +")' style='border:2px solid black; width:225px; height:225px; float: left; margin-left: 25px; margin-right: 25px; margin-top: 25px; margin-bottom: 25px;'>";
                    table += "<tr>"
                    table += "<td style='height: 15px; padding-left: 7px; padding-top:3px'>"+ item.id +"</td>"
                    table += "</tr>"
                    table += "<tr>"
                    table += "<td style='text-align:center'>" + name + "</td>"
                    table += "</tr>"
                    table += "<tr>"
                    table += "<td style='text-align:center'>$" + price + "</td>"
                    table += "</tr>"
                    table += "<tr>"
                    table += "<td style='text-align:center'>Quantity Left:" + quantity + "</td>"
                    table += "</tr>"
                    table += "</table>"
                $("#item-id").val(id);
                itemTables.append(table);
              });
          },
          error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service.  Please try again later.'));
        }
    });
}

function displayInputForms() {
    $("#inputs").show();
}
   
    var currentFunds = document.getElementById("funds");
    var dollar = document.getElementById("add-dollar");
    var quarter = document.getElementById("add-quarter");
    var dime = document.getElementById("add-dime");
    var nickel = document.getElementById("add-nickel");

    dollar.addEventListener("click", function() {
        funds.stepUp(100);
    });

    quarter.addEventListener("click", function() {
        funds.stepUp(25);
    });

    dime.addEventListener("click", function() {
        funds.stepUp(10);
    });

    nickel.addEventListener("click", function() {
        funds.stepUp(5);
    });

    $("#purchase-button").click(function (event) {
        var id = $("#item-entry").val();
        var funds = $("#funds").val();
        $("#errorMessages").empty();

        $.ajax ({
            type: "GET",
            url: "http://tsg-vending.herokuapp.com/money/" + funds + "/item/" + id,
            headers: {
                "Accept": "application/json"
            },
            success: function(data) {
                console.log(data);
                var message = "Thank you for your purchase!";
                $("#messages").val(message);
                var change = calculateChange(data);
                $("#change-window").val(change);
                console.log(change);
            },
            error: function(data) {
                var error = data.responseJSON.message;
                console.log(error);
                $("#messages").val(error);
            }
        })
        hideItems();
        loadItems();
    });

    function itemSelect(id) {
        $("#item-entry").val(id);
        $("#errorMessages").empty();
    };

    function calculateChange(data) {
        var quarters = data.quarters;
        var dimes = data.dimes;
        var nickels = data.nickels;
        var pennies = data.pennies;
        var changeDue = "";

        if(quarters == 1) {
            changeDue = changeDue + " 1 Quarter";
        }
        if (quarters > 1) {
            changeDue = changeDue + " " + quarters + " Quarters";
        }
        if(dimes == 1) {
            changeDue = changeDue + " 1 Dime";
        }
        if (dimes > 1) {
            changeDue = changeDue + " " + dimes + " Dimes";
        }
        if(nickels == 1) {
            changeDue = changeDue + " 1 Nickel";
        }
        if (nickels > 1) {
            changeDue = changeDue + " " + nickels + " Nickels";
        }
        if(pennies == 1) {
            changeDue = changeDue + " 1 Penny";
        }
        if (pennies > 1) {
            changeDue = changeDue + " " + pennies + " Pennies";
        }
        return changeDue;
    }
    
    $("#change-button").click(function(event) {
        var changeDue = $("#funds").val();
        changeDue = changeDue * 100;
        
        numPennies = changeDue;     
        
        numQuarters = Math.floor(numPennies / 25);
        
        numPennies = numPennies % 25;

        numDimes = Math.floor(numPennies / 10);
        numPennies = numPennies % 10;

        numNickels = Math.floor(numPennies / 5);
        numPennies = numPennies % 5;

        console.log(numQuarters);

        var changeDue = "";

        if(numQuarters == 1) {
            changeDue = changeDue + " 1 Quarter";
        }
        if (numQuarters > 1) {
            changeDue = changeDue + " " + numQuarters + " Quarters";
        }
        if(numDimes == 1) {
            changeDue = changeDue + " 1 Dime";
        }
        if (numDimes > 1) {
            changeDue = changeDue + " " + numDimes + " Dimes";
        }
        if(numNickels == 1) {
            changeDue = changeDue + " 1 Nickel";
        }
        if (numNickels > 1) {
            changeDue = changeDue + " " + numNickels + " Nickels";
        }
        if(numPennies == 1) {
            changeDue = changeDue + " 1 Penny";
        }
        if (numPennies > 1) {
            changeDue = changeDue + " " + numPennies + " Pennies";
        }
        $("#change-window").val(changeDue);
        $("#funds").val("");

    });

    function hideItems() {
        $("#item-table").val("");
    }
