function Highlighter() {
    var recipientEls = [];

    this.showRecipients = function() {
        for (var i=0; i<scraper.$els.length; i++) {
            var el = scraper.$els[i];
            var recipient = scraper.tips[i].for;
            createRecipientEl(el, recipient);
        }
    }

    this.hideRecipients = function() {
        for (var i=0; i<recipientEls.length; i++) {
            recipientEls[i].remove();
        }
    }

    var createRecipientEl = function(el, recipient) {
        var div = $(document.createElement("div"));
        div.text("Like this? Tip " + recipient);
        var borderWidth = 4;
        var borderThickness = borderWidth * 2;
        var position = el.position();
        div.css({
            position: "absolute",
            width: el.width() - borderThickness,
            height: el.height() - borderThickness,
            margin: el.css("margin"),
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
}

var highlighter = new Highlighter();
