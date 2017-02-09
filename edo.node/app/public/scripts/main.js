var Main = (function() {
    function Main() {}
    Main.openDoor = function() {
        $.ajax({url: "/command/opendoor"}).done(function(response) {
            $("#response").html(response.stdout.toString());
        });
    };
    return Main;
}());