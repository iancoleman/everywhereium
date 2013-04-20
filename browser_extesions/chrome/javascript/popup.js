function init(tabId) {
    chrome.tabs.sendMessage(tabId, {}, function(response) {
        var tips = response.data;
        for (var i=0; i<tips.length; i++) {
            var tip = tips[i];
            var tipEl = createPopupContent(tip);
            $("body").append(tipEl);
        }
        if (tips.length == 0) {
            $("body").text("No tips on this page");
        }
    });
}

function createPopupContent(tip) {
    return $("<div>" + tip.id.replace(/\s/g,"&nbsp;") + "</div>");
}

$(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        var tabId = tab[0].id;
        init(tabId);
        $("body").show();
    });
})
