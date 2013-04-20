var tips = [];
var $els = [];
var recipientEls = [];
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.show) {
        tips = [];
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
        sendResponse({data: tips});
        highlightRecipients();
    }
    else if (request.hide) {
        unhighlightRecipients();
    }
});

function highlightRecipients() {
    for (var i=0; i<$els.length; i++) {
        createRecipientEl($els[i], tips[i].for);
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

function unhighlightRecipients() {
    for (var i=0; i<recipientEls.length; i++) {
        recipientEls[i].remove();
    }
}
