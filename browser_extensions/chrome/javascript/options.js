function loadOptions() {
    var bitcoinclient = localStorage["bitcoinclient"];
    if (bitcoinclient) {
        $("#" + bitcoinclient).prop("checked", true);
    }
    var paypalemail = localStorage["paypalemail"];
    $("#paypalemail").val(paypalemail);
    var paypalclient = localStorage["paypalclient"];
    if (paypalclient) {
        $("#" + paypalclient).prop("checked", true);
    }
}

function saveOptions() {
    saveOption("bitcoinclient", $("input[name=bitcoinclient]:checked").val());
    saveOption("paypalemail", $("#paypalemail").val());
    saveOption("paypalclient", $("input[name=paypalclient]:checked").val());
    $("#save").text("Saved!")
    setTimeout(function() { $("#save").text("Save") }, 1000);
}

function saveOption(key, val) {
    if (val != "") {
        localStorage[key] = val;
    }
    else {
        delete localStorage[key];
    }
}

$("#save").click(saveOptions);
loadOptions();
