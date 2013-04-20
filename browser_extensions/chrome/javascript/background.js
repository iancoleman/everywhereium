function popupClosed(tabId) {
    chrome.tabs.sendMessage(tabId, {hide: true}, null);
}
