/* 
$(document).ready(function () {
    $('.wc-header, .cust_rep').click(function () {
        $('.chat').addClass("active");
        $('.chat_open_close').addClass("down")
    })
});
$(document).ready(function () {
    $('.chat_open_close').click(function () {
        $('.chat').toggleClass("active");
        $('.chat_open_close').toggleClass("down")
    })
});
 */


/* ANGULAR APPLICATION
var app = angular.module('smartBuy', ['luegg.directives']);
app.constant('_', window._);
app.run(function ($rootScope) {
    $rootScope._ = window._;
});
var slide = false;
app.controller('chatctrl', ['$scope', '$http', '_', function ($scope, $http, _) {
    $scope.test = "test variable";
    var packageToBeSent = {};
    var chat = [];
    var chatMessage = {};
    $scope.chatCollapsed = false;
    function scrollToBottom() {
        // $("#chat").scrollTop($("#chat").scrollTop() + $("#chat").height());
    }

    function pushonArray(callback) {
        chat.push(chatMessage);
        setTimeout(callback, 0);
    }

    $scope.chattingMessages = chat;
    $scope.sendMessage = function () {
        // console.log($scope.chatMessage);
        var inputVal = $scope.chatMessage;
        var messageUrl = "http://localhost:8080/chat/api/" + inputVal;
        chatMessage.class = "user";
        chatMessage.message = inputVal;
        chat.push(chatMessage); //users conversation gets pushed into chat
        chatMessage = {};
        // console.log(chat);
        $scope.chatMessage = "";

        $http.get(messageUrl).then(function (response) {
            console.log(response);
            var collectedData = _.pick(response.data.result, ['action', 'actionIncomplete', 'parameters', 'fulfillment.speech']);
            chatMessage.class = "bot";
            chatMessage.message = collectedData.fulfillment.speech;
            pushonArray(scrollToBottom); //BOt's chat gets pushed into chat
            chatMessage = {};
        });
    }

    $scope.chatCollapse = function () {
        $scope.chatCollapsed = true;
        $(".chatBoxWrapper").slideUp();
    }
    $scope.chatOpen = function () {
        $scope.chatCollapsed = false;
        $(".chatBoxWrapper").slideDown();
    }
}]);
*/
