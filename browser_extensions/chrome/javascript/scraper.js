
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
        _this.tips.push({
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

    var getRemoteAddress = function() {
        // make ajax call
        var data = {
            id: "wholesitetip",
            destination: {
                type: "bitcoin",
                address: "1armory"
            }
        }
        setTimeout(function() {
            _this.$els.push($("body"));
            sendPendingAddress(data)
        }, 500);
    }
}

var scraper = new Scraper();
