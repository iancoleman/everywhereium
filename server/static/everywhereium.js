(function() {

    function init() {
        var els = document.querySelectorAll("[tip]");
        for (var i=0; i<els.length; i++) {
            var el = els[i];
            addTipButton(el);
        }
    }

    function addTipButton(el) {
        var button = document.createElement("div");
        button.innerHTML = "Tip";
        setStyle(button);
        button.style.cursor = "pointer";
        button.data = {};
        button.data.el = el;
        el.data = {};
        el.data.button = button;
        addClickEvent(button, showTipDialog);
        document.body.appendChild(button);
        setPosition(button);

        createTipDialog(el);
    }

    function setStyle(el) {
        el.style.position = "absolute";
        el.style.color = "#FFF";
        el.style.backgroundColor = "#1763A6";
        el.style.padding = "0.3em 0.5em";
        el.style.borderRadius = "7px";
    }

    function showTipDialog(e) {
        e.target.data.el.data.button.style.display = "none";
        e.target.data.el.data.dialog.style.display = "block";
    }

    function hideTipDialog(e) {
        e.target.data.el.data.dialog.style.display = "none";
        e.target.data.el.data.button.style.display = "block";
    }

    function setPosition(button) {
        var margin = 3; //px
        var el = button.data.el;
        button.style.left = (el.offsetLeft + el.offsetWidth - button.offsetWidth - margin) + "px";
        button.style.top = (el.offsetTop + margin) + "px";
    }

    function addClickEvent(el, handler) {
        if (el.addEventListener) {
            el.addEventListener("click", handler, false);
        }
        else if (button.attachEvent) {
            el.attachEvent("onClick", handler);
        }
    }

    function setText(el, content) {
        if (el.innerText) {
            el.innerText = content;
        }
        else {
            el.textContent = content;
        }
    }

    function handleButtonClick(e) {
    }

    function createTipDialog(el) {
        var button = el.data.button;

        var tipString = el.getAttribute("tip");
        var tip = JSON.parse(tipString);

        /* Templating seems overkill for this dialog, even though
         * I hate doing html in javascript */
        var dialog = document.createElement("div");
        setStyle(dialog);
        el.data.dialog = dialog;
        dialog.data = {};
        dialog.data.el = el;

        var closeButton = document.createElement("div");
        closeButton.style.position = "absolute";
        closeButton.style.top = "2px";
        closeButton.style.right = "4px";
        closeButton.style.cursor = "pointer";
        closeButton.data = {};
        closeButton.data.el = el;
        setText(closeButton, '\u2A2F');
        addClickEvent(closeButton, hideTipDialog);
        dialog.appendChild(closeButton);

        var name = document.createElement("div");
        name.style.fontSize = "29px";
        name.style.padding = "10px 0";
        setText(name, tip.for);
        dialog.appendChild(name);

        var table = document.createElement("table");
        table.style.position = "relative";
        for (var i=0; i<tip.destinations.length; i++) {
            var d = createDestinationRow(tip.destinations[i]);
            table.appendChild(d);
        }

        dialog.appendChild(table);
        document.body.appendChild(dialog);

        setPosition(dialog);

        dialog.style.display = "none";
    }

    function createDestinationRow(destination) {
        var row = document.createElement("tr");

        var typeCell = document.createElement("td");
        setText(typeCell, destination.type);
        typeCell.style.paddingRight = "20px";
        row.appendChild(typeCell);

        var detailCell = document.createElement("td");
        if (destination.type in destinationPresenters) {
            var presenter = destinationPresenters[destination.type];
            var content = presenter(destination);
            detailCell.innerHTML = content;
        }
        else {
        }
        detailCell.style.cursor = "auto";
        row.appendChild(detailCell);
        return row;
    }

    function bitcoinPresenter(destination) {
        return "<a style='color:#FFF' target='_blank' href='bitcoin:" + destination.address + "'>" +
            destination.address + "</a>";
    }

    function paypalPresenter(destination) {
        var url = "https://paypal.com/xclick/business=" + destination.address;
        return "<a style='color:#FFF' target='_blank' href='" + url + "'>" +
            destination.address + "</a>";
    }

    var destinationPresenters = {
        "bitcoin": bitcoinPresenter,
        "paypal": paypalPresenter
    }

    init();

})()
