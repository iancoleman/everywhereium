var tips = [];
var $els = [];
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
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
})
