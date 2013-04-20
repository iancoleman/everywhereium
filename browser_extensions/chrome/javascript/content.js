var tips = [];
var $els = [];
var recipientEls = [];
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.show) {
        getTips();
        sendResponse({data: tips});
    }
    else if (request.hide) {
        unhighlightRecipients();
    }
});

function getTips() {
    tips = [];
    $els = [];
    $("[tip]").each(function(i) {
        try {
            var $el = $(this);
            var tipStr = $el.attr("tip");
            var tip = JSON.parse(tipStr);
            tips.push(tip);
            $els.push($el);
        }
        catch (e) {}
    });
    if (tips.length == 0) {
        getRemoteTip();
    }
    highlightRecipients();
}

function getRemoteTip() {
    tips.push({
        for: "This website",
        destinations: [
            {
                "type": "pending",
                "id": "wholesitetip"
            }
        ]
    });
    getRemoteAddress();
}

function getRemoteAddress() {
    // make ajax call
    setTimeout(sendPendingAddress, 500);
}

function sendPendingAddress(data) {
    var params = {
        id: "wholesitetip",
        destination: {
            type: "bitcoin",
            address: "1armory"
        }
    }
    chrome.extension.sendMessage(params);
    $els.push($("body"));
    highlightRecipients();
}

function highlightRecipients() {
    for (var i=0; i<$els.length; i++) {
        createRecipientEl($els[i], tips[i].for);
    }
}

function unhighlightRecipients() {
    for (var i=0; i<recipientEls.length; i++) {
        recipientEls[i].remove();
    }
}

function createRecipientEl(el, recipient) {
    var div = $(document.createElement("div"));
    div.text("Like this? Tip " + recipient);
    var borderWidth = 4;
    var borderThickness = borderWidth * 2;
    var position = el.position();
    div.css({
        position: "absolute",
        width: el.width() - borderThickness,
        height: el.height() - borderThickness,
        top: position.top,
        left: position.left,
        border: borderWidth + "px solid red",
        textAlign: "center",
        fontSize: "1.6em",
        fontWeight: "bold",
        backgroundColor: "rgba(255,255,255,0.3)",
        padding: "1em 0"
    });
    recipientEls.push(div);
    $("body").append(div);
}
