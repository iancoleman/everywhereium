var Popup = function() {
    var _this = this;

    this.createContent = function(tips) {
        var el = $(document.createElement("div"));
        var table = renderTable(tips);
        el.html(table);
        return el;
    }

    this.showPendingDestination = function(elId, destination) {
        $("#" + elId).html(renderBitcoinButton(destination));
    }

    var renderTable = function(tips) {
        // Chrome extensions don't allow eval which underscore templating
        // engine requires. boourns.
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
                    htmlescape(tip.for).replace(/\s/g,"&nbsp;") +
                "</td>" +
                renderDestinationButtons(tip, cols) +
            "</tr>";
        }
        table += "</table>";
        return table
    }

    var renderBitcoinButton = function(destination) {
        switch (settings.bitcoinclient) {
            case "bitcoinqr":
                return renderBitcoinQr(destination);
            case "bitcoinuri":
                return showBitcoinUri(destination);
        }
    }

    var renderBitcoinUri = function(destination) {
        var uri = "bitcoin:" + htmlescape(destination.address);
        return "<a href='" + uri + "' target='_blank' class='btn bitcoin'>Bitcoin</a>";
    }

    var renderBitcoinQr = function(destination) {
        // This needs to display the qr, not the bitcoin uri
        var uri = "bitcoin:" + htmlescape(destination.address);
        return "<a href='" + uri + "' target='_blank' class='btn bitcoin'>Bitcoin</a>";
    }

    var htmlescape = function(text) {
        return $(document.createElement("div")).text(text).html();
    }

    var renderPaypalButton = function(destination) {
        switch (settings.paypalclient) {
            case "paypalqr":
                return renderPaypalQr(destination);
            case "paypalweb":
                return renderPaypalWeb(destination);
        }
    }

    var renderPaypalWeb = function(destination) {
        var url = "https://paypal.com/xclick/business=" + htmlescape(destination.address);
        return "<a href='" + url + "' target='_blank' class='btn paypal'>Paypal</a>";
    }

    var renderPaypalQr = function(destination) {
        return "<a href='#' target='_blank' class='btn paypal'>Paypal</a>";
    }

    var renderPendingButton = function(destination) {
        return "<div id='" + destination.id + "'><img src='../images/pending.gif'></a>";
    }

    var buttonRenderers = {
        "bitcoin": renderBitcoinButton,
        "paypal": renderPaypalButton,
        "pending": renderPendingButton
    }

    var renderDestinationButtons = function(tip, cols) {
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

}

var popup = new Popup();
