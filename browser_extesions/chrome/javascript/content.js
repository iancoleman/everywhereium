chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var tippingPoints = $("div[tip]").attr("tip");
    sendResponse({msg: tippingPoints});
})

