var express = require('express');
var app = express();


app.get('/sample/:deliverid/:orderid/:number', function (req, res) {

    var deliver = req.params.deliverid;
    var order = req.params.orderid;
    var n = req.params.number;
    var json = {
        "delivery": "",
        "order": ""
    };
    if (deliver == "C" && order == "C" && (n == "0000005017" || "0000004983" || "0000005006" || "0000005013" || "0000005077")) {
        console.log("inside the cc");
        //res.write("the delivered");
        //res.end("the order");

        json.delivery = "Delivery status of the order with number " + n + " is completely processed.";
        json.order = "Overall status of the order with number " + n + " is completely processed.";
        console.log(json);
        res.json(json);
        //res.send("The Delivery status of your order  " +n+" is completely processed and Overall Order Status is completely processed.");
    } else if (deliver == "B" && order == "A" && (n == "0000011764" || "0000012006" || "0000012010" || "0000014795")) {
        console.log("inside ba");
        json.delivery = "Delivery status of order with number " + n + " is partially processed.";
        json.order = "Overall order status of order with number " + n + " is not yet processed.";
        console.log(json);
        res.json(json);
    } else if (deliver == "C" && order == "A") {
        console.log("inside ca");
        res.send("N/A");
    } else if (deliver == "A" && order == "B") {
        console.log("inside ab");
        res.send("N/A");
    } else if (deliver == "B" && order == "B" && (n == "0000006331" || "0000007498" || "0000008665" || "0000009629")) {
        console.log("inside bb");
        json.delivery = "Delivery status of order with number " + n + " is partially processed.";
        json.order = "Overall order status of order with number " + n + " is partially processed.";
        console.log(json);
        res.json(json);

    } else if (deliver == "C" && order == "B" && (n == "0000011786" || "0060000081" || "0060000089" || "0060000094")) {
        console.log("inside cb");
        json.delivery = "Delivery status of order with number " + n + " is partially processed.";
        json.order = "Overall order status of order with number " + n + " is partially processed.";
        console.log(json);
        res.json(json);

    } else if (deliver == "A" && order == "C") {
        console.log("inside ac");
        res.send("N/A");
    } else if (deliver == "B" && order == "C") {
        console.log("inside bc");
        res.send("N/A");
    } else if (deliver == "A" && order == "A" && (n == "0000008976" || "0000008977" || "0000008998" || "0000009305")) {
        console.log("inside aa");
        json.delivery = "Delivery status of order with number " + n + " is not yet processed.";
        json.order = "Overall order status of order with number " + n + " is not yet processed.";
        console.log(json);
        res.json(json);
    } else {
        console.log("noting");
        res.send("not yet");
    }

});

app.listen(4001, function () {
    console.log("http://172.17.13.33:4001");
});