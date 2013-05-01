$("#claim").click(function() {
    var site = $("#url").val();
    $.ajax({
        url: "/api/rescan",
        data: {
            site: site
        },
        success: function(data) {
            $("#response").text("We've arranged to have your tips sent to " + data + " - they should be there sometime in the next 48 hours. Any future tips for your site will go directly to that address.")
        },
        error: function(data) {
            $("#response").text(data.responseText);
        }
    });
});
