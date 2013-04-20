var settings = {}

function loadSettings() {
    settings = {
        bitcoinclient: localStorage["bitcoinclient"],
        paypalemail: localStorage["paypalemail"]
    }
    if (!(settings.bitcoinclient)) {
        localStorage["bitcoinclient"] = "bitcoinqr";
        settings.bitcoinclient = "bitcoinqr";
    }
    if (!(settings.paypalclient)) {
        localStorage["paypalqr"] = "paypalqr";
        settings.paypalclient = "paypalqr";
    }
}

 function scrapeTab(tabId) {
    chrome.tabs.sendMessage(tabId, {show: true}, function(response) {
        var tips = response.data;
        var table = popup.createContent(tips);
        $("body").append(table);
        $("body").show();
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
    loadSettings();
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        var tabId = tab[0].id;
        listenForPopupClosed(tabId);
        listenForPendingAddresses();
        scrapeTab(tabId);
    });
})

