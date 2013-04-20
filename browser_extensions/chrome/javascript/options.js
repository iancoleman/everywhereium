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
    $("input[type=text], input[type=email]").keyup(setSaveButton);
    $("input[type=radio]").change(setSaveButton);
}

function saveOptions() {
    saveOption("bitcoinclient", $("input[name=bitcoinclient]:checked").val());
    saveOption("paypalemail", $("#paypalemail").val());
    saveOption("paypalclient", $("input[name=paypalclient]:checked").val());
    $("#save").text("Saved!")
}

function setSaveButton() {
    $("#save").text("Save");
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
