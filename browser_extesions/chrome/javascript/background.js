function popupOpened() {
    var popupWatcher = setInterval(function() {
        var popup = chrome.extension.getViews({type: "popup"});
        if (popup.length == 0) {
            clearInterval(popupWatcher);
            popupClosed();
        }
    }, 100);
}

function popupClosed() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        var tabId = tab[0].id;
        chrome.tabs.sendMessage(tabId, {hide: true}, null);
    });
}
