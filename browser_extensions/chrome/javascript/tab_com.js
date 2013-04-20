chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.show) {
        scraper.getTips();
        highlighter.showRecipients();
        sendResponse({data: scraper.tips});
    }
    else if (request.hide) {
        highlighter.hideRecipients();
    }
});

function sendPendingAddress(data) {
    chrome.extension.sendMessage(data);
    highlighter.showRecipients();
}
