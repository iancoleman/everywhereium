$("#claim").click(function() {
    var site = $("#url").val();
    $.ajax({
        url: "/api/rescan",
        data: {
            site: site
        },
        success: function(data) {
            console.log(data);
            alert(data);
        },
        error: function(data) {
        }
    });
});
