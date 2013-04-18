function init(tabId) {
    chrome.tabs.sendMessage(tabId, {}, function(response) {
        var tips = JSON.parse(response.msg);
        var content = createPopupContent(tips);
        $("body").append(content);
    });
}

function createPopupContent(tips) {
    return $("<div>" + tips.id + " - " + tips.address + "</div>");
}

$(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        init(tab[0].id);
        $("body").show();
    });
})
