function loadOptions() {
    var bitcoinclient = localStorage["bitcoinclient"];
    if (bitcoinclient) {
        $("#" + bitcoinclient).prop("checked", true);
    }
    var paypalemail = localStorage["paypalemail"];
    $("#paypalemail").val(paypalemail);
}

function saveOptions() {
    saveOption("bitcoinclient", $("input[name=bitcoinclient]:checked").val());
    saveOption("paypalemail", $("#paypalemail").val());
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
