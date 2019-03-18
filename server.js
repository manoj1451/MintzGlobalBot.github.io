var restify = require('restify');
var builder = require('botbuilder');
var LUIS = require('luis-sdk');
var moment = require('moment');
var ping = require("ping");
var unirest = require("unirest");

var bot = new builder.UniversalBot(connector);
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log("--------------------------------------------------------");
    console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " |  OrderBot is running with the address : " + server.url);
    console.log("--------------------------------------------------------");
});
var connector = new builder.ChatConnector({
	appId:"",
	appPassword:""
   // appId: "4b94fee7-0eb3-48ff-a6f2-a8edbcf3cc09", // pdadi dev.botframework
   // appPassword: "C0wbi0ZHmdiVXtpFXqdPrtU"
    // appId: "b74fd7d5-79a3-429d-a06f-87247e3fd250",// Archit's dev.botframework
    // appPassword: "tXzooSjGVmbExMKgu5hbmXJ"
	//appId: "364f07a4-9581-4967-8435-fc537bc5d468", //harshitha visual acc
   //appPassword: "HCsZBjQxqOZ1FknLbBkd9XX"
   //appId:"",
   //appPassword:""
});
var dataStore=[{}];
var p=0;


server.use(restify.conditionalRequest());
var bot = new builder.UniversalBot(connector);
var model='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/af9f9d58-e570-4519-9a1e-a03a802b93d1?verbose=true&timezoneOffset=-360&subscription-key=6d3d1738a14b470994758b2b8a889c02&q=';

//var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ad661780-f53f-4cc1-a429-36893981e9c1?subscription-key=d41db90fb254424a9d313d75bb1d574f&timezoneOffset=0&verbose=true&q='; // Harshitha 's account
// var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ad661780-f53f-4cc1-a429-36893981e9c1?subscription-key=d41db90fb254424a9d313d75bb1d574f&timezoneOffset=0&verbose=true&q='; // Harshitha 's account
// var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9d9f4cf4-b425-4d31-ab0f-8c5d60742ca3?subscription-key=f7a59233d11d4949a6ed6087080d2a90&timezoneOffset=0&verbose=true&q=';// Archit account
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({
    recognizers: [recognizer]
});
var n = 0;
server.post('/api/messages', connector.listen());
bot.dialog('/', dialog);

/*server.get('/',function (req, res, next) {
 res.sendFile('/index.html');
 });*/
server.get(/.*/, restify.serveStatic({
    'directory': __dirname + '/',
    'default': 'index.html'
}));


dialog.matches('Greetings', [
    function (session, args) {
        session.sendTyping();
		console.log(session,args);
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " | Greetings Intent Matched");
        console.log("--------------------------------------------------------");
        session.send("Hello, I am Alvis. How can I help you?");

    }
]);

dialog.matches('Capabilities', [
    function (session, args) {
        session.sendTyping();
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " | Capabilities Intent Matched");
        console.log("--------------------------------------------------------");
        session.send("I can help you with retrieving Order and Delivery status.");
    }
]);

var order={};
var json = {};


var a=[];
var delivery={};
dialog.matches('userquestion', [
    function (session, args) {
        session.sendTyping();
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " |Question  Intent Matched");
        console.log("--------------------------------------------------------");
        var num = "";
        if (args.entities.length == 0) {
            console.log(args.entities);
			session.dialogData.num='';
			session.beginDialog('/OrderCheck', session.dialogData.num);
			session.dialogData.num;
        } else {
			
            session.dialogData.num= args.entities[0].entity;
           
            getsample(session.dialogData.num, function (s) {
                console.log(s);
                if (s.s1 && s.s2 && s.s3) {

                    getResponseText(s.s1, s.s2, session.dialogData.num, function (e) {
                        console.log("hars" + JSON.stringify(e));
						console.log("anush");
                      console.log(session.message.user.id);
                        session.send(e.order);

                    });
                                  }
                else {
                    session.send("Sorry, the order with number " + session.dialogData.num + " could not be found.");
                    session.beginDialog('/askOrderStatus', {
                        "num": session.dialogData.num

                    });
                }
            });
        }
    },
    function (session, args, next) {
        console.log("inside the value");

    }

]);



function getsample(args1, callback) {
    console.log("inside het sample");

console.log(args1);
    unirest.get("http://12.28.130.97:8011/sap/opu/odata/sap/ZSAP_GET_SOSTATUS_SRV/SOStatusSet('" + args1+ "')/SOStatusesNav?$format=json")
        .auth({
            user: 'piuser',
            pass: 'miracle9'
        })
        .end(function (response) {
            if (response.error) {
                callback(response.error)
            }
            else {
                json.s2 = response.body.d.results[0].PrcStatH;
                json.s1 = response.body.d.results[0].DlvStatH;
                json.s3 = response.body.d.results[0].DocNumber;
                console.log(json);
                callback(json);

            }
        });
}

function getResponseText(args1, args2, args3, callback) {
   
    console.log(args1);
    console.log(args2);
    console.log(args3);
    var deliver = args1;
    var order = args2;
    var n = args3;
    var json = {
        "delivery": "",
        "order": ""
    };
    if (deliver == "C" && order == "C" && (n == "0000005017" || "0000004983" || "0000005006" || "0000005013" || "0000005077")) {


        json.delivery = "Delivery status of the order with number " + n + " is completely processed.";
        json.order = "Overall status of the order with number " + n + " is completely processed.";
       
        callback(json);
        
    } else if (deliver == "B" && order == "A" && (n == "0000011764" || "0000012006" || "0000012010" || "0000014795")) {
        
        console.log("inside ba");
        json.delivery = "Delivery status of order with number " + n + " is partially processed.";
        json.order = "Overall order status of order with number " + n + " is not yet processed.";
        console.log(json);
        callback(json);
        
    } else if (deliver == "C" && order == "A") {
        console.log("inside ca");
        callback("N/A");
        
    } else if (deliver == "A" && order == "B") {
        console.log("inside ab");
        callback("N/A");
        
    } else if (deliver == "B" && order == "B" && (n == "0000006331" || "0000007498" || "0000008665" || "0000009629")) {
        
        console.log("inside bb");
        json.delivery = "Delivery status of order with number " + n + " is partially processed.";
        json.order = "Overall order status of order with number " + n + " is partially processed.";
        console.log(json);
        callback(json);
       

    } else if (deliver == "C" && order == "B" && (n == "0000011786" || "0060000081" || "0060000089" || "0060000094")) {
        
        console.log("inside cb");
        json.delivery = "Delivery status of order with number " + n + " is completely processed.";
        json.order = "Overall order status of order with number " + n + " is partially processed.";
        console.log(json);
        callback(json);
       

    } else if (deliver == "A" && order == "C") {
        console.log("inside ac");
        callback("N/A");
       
    } else if (deliver == "B" && order == "C") {
        console.log("inside bc");
        callback("N/A")
        
    } else if (deliver == "A" && order == "A" && (n == "0000008976" || "0000008977" || "0000008998" || "0000009305")) {
        
        console.log("inside aa");
        json.delivery = "Delivery status of order with number " + n + " is not yet processed.";
        json.order = "Overall order status of order with number " + n + " is not yet processed.";
        console.log(json);
        callback(json);
        
    } else {
        console.log("noting");
        callback(json);
        
    }


}
bot.dialog('/OrderCheck', [
    function (session, args, next) {
        console.log(args);
        if (args== "") {
			console.log("order check");
			console.log(session.dialogData.num)
            session.beginDialog('/askOrderStatus',session.dialogData.num);
        } else {
            next(args);
        }
    }, function (session, args, next) {


    }
]);

bot.dialog('/askOrderStatus', [
    function (session, args) {
		console.log('this is ask order status');
     
        if (n == 0) { 
            builder.Prompts.text(session, "Ask the customer for the order number.");
        } else {
            builder.Prompts.text(session, "Please provide me your order number.");
        }

        
    },
    function (session, args,results) {
		console.log('this is order args: '+args);
        session.dialogData.num = args.response;
		console.log('askOrderStatus');
		dataStore[p]={
			a:'',
			b:''
		}
		dataStore[p].a=session.dialogData.num;
		dataStore[p].b=session.message.user.id;
		getsample(session.dialogData.num, function (s) {
            if (s.s1 && s.s2 && s.s3) {

                getResponseText(s.s1, s.s2, session.dialogData.num, function (e) {
                    console.log("hars" + JSON.stringify(e));
                 
                    n = 0;
					
					session.endConversation(e.order);
					
                })
                
            }
			
             else {
                console.log(JSON.stringify(json.sample));
                session.send("Sorry, the order with number " + session.dialogData.num + " could not be found.");
                n = 1;
                session.beginDialog('/askOrderStatus', {
                    "num": session.dialogData.num,
                    "reprompt": true
                })

            }
			p++;
        });

    }

]);

bot.dialog('/DeliveryCheck', [
    function (session, args, next) {
        if (args.num == "") {
            session.beginDialog('/askDeliveryStatus', {
                "num": args.num
            });
        } else {
            next(args);
        }
    }, function (session, args, next) {


    }
]);
/* bot.dialog('/delivery', [
    function (session, args, next) {
        if (session.dialogData.num) {
            session.beginDialog('/delivery_ques', {
                "num": session.dialogData.num
            });
        } else {
            next(args);
        }
    }, function (session, args, next) {


    }
]); */

bot.dialog('/askDeliveryStatus', [
    function (session, args) {
        if (args.num = "") {
            session.dialogData.num = args.num;
            builder.Prompts.text(session, "Sure, I can help. Please provide me your Delivery number along with your query.");
        }
        else {
            getsample(json, function (s) {

                console.log(s);
                if (s.s1 && s.s2 && s.s3) {

                    getResponseText(s.s1, s.s2, session.dialogData.num, function (e) {
                        console.log("hars" + JSON.stringify(e));
                        
                        n = 0;
                        session.endConversation(e.delivery);

                    });
                    
                }
                else {
                    session.endConversation("Sorry, the order with number " + json.sample + " could not be found.");
                }
            });
        }

    }

]);

bot.dialog('/askSys2', [
    function (session, args) {

        session.dialogData.num = args.num;
        builder.Prompts.text(session, "Please provide me your order number.");
        

    },
    function (session, args, callback) {
        session.dialogData.num = args.response;

        getsample(session.dialogData.num, function (s) {
            if (s.s1 && s.s2 && s.s3) {
                getResponseText(s.s1, s.s2, session.dialogData.num, function (e) {
                    console.log("hars" + JSON.stringify(e));
                    //var sample = e.delivery;
                    n = 0;
					session.send(e.delivery)
					//session.replaceDialog('/delivery_ques',session.dialogData.num);
                    //session.endConversation(e.delivery);
                });
                
            }
            else {
                n = 1;
                session.endConversation("Sorry, the order with number " + session.dialogData.num + " could not be found.");
            }
        });
    }
]);


dialog.matches('delivery_ques', [
    function (session, args) {
        session.sendTyping();
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " |Question  Intent Matched");
        console.log("--------------------------------------------------------");
    
        if (args.entities.length == 0) {
			
			if(session.dialogData.num){
				
			getsample(session.dialogData.num, function (s) {
                
                if (s.s1 && s.s2 && s.s3) {

                    getResponseText(s.s1, s.s2, session.dialogData.num, function (e) {
                        console.log("hars" + JSON.stringify(e));
                        session.send(e.delivery);

                    });
                    
                }
                else {
                    session.send("Sorry, the order with number " + session.dialogData.num + " could not be found.");
                    session.beginDialog('/askSys2', {
                        "num": session.dialogData.num
                    })
                }
            });
		}
		else{
				
			console.log(session.message.user.id);
			for(var i=0;i<dataStore.length;i++){
				console.log(dataStore[i]);
				if(session.message.user.id ==dataStore[i].b){
            getsample(dataStore[i].a, function (s) {
                console.log(s);
                if (s.s1 && s.s2 && s.s3) {
				//console.log('this is response text '+dataStore[i].a);
                    getResponseText(s.s1, s.s2, s.s3, function (e) {
                        console.log("hars" + JSON.stringify(e));
                       // var sample1 = e.delivery;
						session.send(e.delivery);
                        //session.endConversation(sample1);
						//session.dialogData.num=="";

                    });
                    
                }
               /*  else {
                    session.send("Sorry, the order with number " +delivery + " could not be found.");
                    session.beginDialog('/askSys2', {
                        "num": delivery
                    })
                } */
            });
				}
				dataStore[i].b=null;
                dataStore[i].a=null;
			}
			
			
			
		}
			
			
			
			
        } else {
            
            json.sample = args.entities[0].entity;
			var sample1=json.sample;
            getsample(sample1, function (s) {
                console.log(s);
                if (s.s1 && s.s2 && s.s3) {

                    getResponseText(s.s1, s.s2, sample1, function (e) {
                        console.log("hars" + JSON.stringify(e));
                       
                        session.send(e.delivery);

                    });
                    
                }
                else {
                    session.send("Sorry, the order with number " +sample1+ " could not be found.");
                    session.beginDialog('/askSys2', {
                        "num": session.dialogData.num
                    })
                }
            });
        }
		
    },
    function (session, args, next) {
        console.log("inside the value");
    }
]);

dialog.matches('Thank you', [
    function (session, args) {
        session.sendTyping();
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " | Thank you Intent Matched");
        console.log("--------------------------------------------------------");
        session.send("My pleasure! Let me know if you need anything else.");
    }
]);

dialog.matches('conformation', [
    function (session, args) {
        session.sendTyping();
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " | Thank you Intent Matched");
        console.log("--------------------------------------------------------");
        session.send("Thanks, have a great day.");
    }
]);

dialog.matches('conf_yes', [
    function (session, args) {
        session.sendTyping();
        console.log("--------------------------------------------------------");
        console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " | Thank you Intent Matched");
        console.log("--------------------------------------------------------");
        session.send("I can help you with retrieving Order and Delivery status");
    }
]);

dialog.onDefault(builder.DialogAction.send("Sorry, trouble understanding you.I can help you Order and Delivery statues "));