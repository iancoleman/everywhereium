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
    "<tr><th>Recipient</th><th colspan='99'>Tip using</th></tr>";
    for (var i=0; i<tips.length; i++) {
        var tip = tips[i];
        table += "<tr>" +
            "<td>" +
                tip.for.replace(/\s/g,"&nbsp;") +
            "</td>" +
            renderDestinationButtons(tip) +
        "</tr>";
    }
    table += "</table>";
    return table
}

function renderBitcoinButton(destination) {
    return "BITCOIN";
}

function renderPaypalButton(destination) {
    return "PAYPAL";
}

var buttonRenderers = {
    "bitcoin": renderBitcoinButton,
    "paypal": renderPaypalButton
}

function renderDestinationButtons(tip) {
    var buttonCells = "";
    var destinations = tip.destinations;
    for (var j=0; j<destinations.length; j++) {
        var destination = destinations[j];
        if (destination.type in buttonRenderers) {
            buttonCells += "" +
            "<td>" +
                buttonRenderers[destination.type](destination) +
            "</td>";
        }
    }
    return buttonCells;
}
