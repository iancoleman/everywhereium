 function init(tabId) {
    listenForPopupClosed(tabId);
    listenForPendingAddresses();
    chrome.tabs.sendMessage(tabId, {show: true}, function(response) {
        var tips = response.data;
        var tipEl = createPopupContent(tips);
        $("body").append(tipEl);
    });
}

function listenForPendingAddresses() {
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        $("#" + request.id).html(renderBitcoinButton(request.destination));
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
    var cols = 0;
    for (var i=0; i<tips.length; i++) {
        if (tips[i].destinations.length > cols) {
            cols = tips[i].destinations.length;
        }
    }
    var table = "" +
    "<table class='table-striped'>" +
    "<tr><th>Recipient</th><th colspan='" + cols + "'>Tip&nbsp;with</th></tr>";
    for (var i=0; i<tips.length; i++) {
        var tip = tips[i];
        table += "<tr>" +
            "<td>" +
                tip.for.replace(/\s/g,"&nbsp;") +
            "</td>" +
            renderDestinationButtons(tip, cols) +
        "</tr>";
    }
    table += "</table>";
    return table
}

function renderBitcoinButton(destination) {
    return "<a href='#' target='_blank' class='btn bitcoin'>Bitcoin</a>";
}

function renderPaypalButton(destination) {
    return "<a href='#' target='_blank' class='btn paypal'>Paypal</a>";
}

function renderPendingButton(destination) {
    return "<a id='" + destination.id + "' href='#'><img src='../images/pending.gif'></a>";
}

var buttonRenderers = {
    "bitcoin": renderBitcoinButton,
    "paypal": renderPaypalButton,
    "pending": renderPendingButton
}

function renderDestinationButtons(tip, cols) {
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
    for (var i=destinations.length; i<cols; i++) {
        buttonCells += "<td></td>";
    }
    return buttonCells;
}
