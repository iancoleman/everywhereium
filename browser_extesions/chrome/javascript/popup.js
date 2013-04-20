
 function init(tabId) {
    listenForPopupClosed(tabId);
    chrome.tabs.sendMessage(tabId, {show: true}, function(response) {
        var tips = response.data;
        var tipEl = createPopupContent(tips);
        $("body").append(tipEl);
    });
}

function listenForPopupClosed(tabId) {
    var background = chrome.extension.getBackgroundPage();
    addEventListener("unload", function (event) {
        background.popupClosed(tabId);
    }, true);
}

function createPopupContent(tips) {
    var el = $(document.createElement("div"));
    var table = renderTable(tips);
    el.html(table);
    return el;
}

$(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        var tabId = tab[0].id;
        init(tabId);
        $("body").show();
    });
})

function renderTable(tips) {
    // Chrome extensions don't allow eval which underscore templating engine
    // requires. boourns.
    var table = "" +
    "<table class='table-striped'>" +
    "<tr><th>Recipient</th><th>Tip using</th></tr>";
    for (var i=0; i<tips.length; i++) {
        table += "<tr>" +
            "<td>" +
                tips[i].for.replace(/\s/g,"&nbsp;") +
            "</td>" +
            "<td>" +
                "Something" +
            "</td>" +
        "</tr>"
    }
    table += "</table>";
    return table
}
