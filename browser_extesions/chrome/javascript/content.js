var tips = [];
var $els = [];
var recipientEls = [];
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.show) {
        tips = [];
        $("div[tip]").each(function(i) {
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
        createRecipientEl($els[i], tips[i].id);
    }
}

function createRecipientEl(el, recipient) {
    var div = $(document.createElement("div"));
    div.text("Like this? Tip " + recipient);
    var borderWidth = 1;
    var borderThickness = borderWidth * 2;
    var position = el.position();
    div.css({
        position: "absolute",
        width: el.width() - borderThickness,
        height: el.height() - borderThickness,
        top: position.top,
        left: position.left,
        border: borderWidth + "px solid red",
        textAlign: "right"
    });
    recipientEls.push(div);
    $("body").append(div);
}

function unhighlightRecipients() {
    for (var i=0; i<recipientEls.length; i++) {
        recipientEls[i].remove();
    }
}
