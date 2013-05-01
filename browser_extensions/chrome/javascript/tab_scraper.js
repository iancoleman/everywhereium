
function Scraper() {
    this.tips = [];
    this.$els = [];

    var _this = this;

    this.getTips = function() {
        _this.tips = [];
        _this.$els = [];
        $("[tip]").each(function(i) {
            try {
                var $el = $(this);
                var tipStr = $el.attr("tip");
                var tip = JSON.parse(tipStr);
                _this.tips.push(tip);
                _this.$els.push($el);
            }
            catch (e) {}
        });
        if (_this.tips.length == 0) {
            getRemoteTip();
        }
    }

    var getRemoteTip = function() {
        /*_this.tips.push({
            for: "This website",
            destinations: [
                {
                    "type": "pending",
                    "id": "everywhereium"
                }
            ]
        });
        getRemoteAddress();
        */
        _this.tips.push({
            for: "This website",
            destinations: [
                {
                    "type": "error",
                    "id": "everywhereium"
                    // No remote escrow service yet.
                }
            ]
        });
    }

    var getRemoteAddress = function() {
        // make ajax call
        $.ajax({
            url: "https://everywhereium.com/api/getAddress",
            data: {
                site: window.location.href
            },
            success: function(data) {
                var data = {
                    id: "everywhereium",
                    destination: {
                        type: "bitcoin",
                        address: data,
                        escrow: true
                    }
                }
                _this.$els.push($("body"));
                sendPendingAddress(data)
            },
            error: function() {
                sendPendingAddress({
                    id: "everywhereium",
                    destination: {
                        type: "error"
                    }
                })
            }
        });
    }
}

var scraper = new Scraper();
