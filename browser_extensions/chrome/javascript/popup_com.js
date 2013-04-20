var settings = {
    bitcoinclient: localStorage["bitcoinclient"] || "bitcoinqr",
    paypalemail: localStorage["paypalemail"]
}

 function init(tabId) {
    listenForPopupClosed(tabId);
    listenForPendingAddresses();
    chrome.tabs.sendMessage(tabId, {show: true}, function(response) {
        var tips = response.data;
        var table = popup.createContent(tips);
        $("body").append(table);
    });
}

function listenForPendingAddresses() {
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        popup.showPendingDestination(request.id, request.destination);
    });
}

function listenForPopupClosed(tabId) {
    var background = chrome.extension.getBackgroundPage();
    addEventListener("unload", function (event) {
        background.popupClosed(tabId);
    }, true);
}

$(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        var tabId = tab[0].id;
        init(tabId);
        $("body").show();
    });
})

