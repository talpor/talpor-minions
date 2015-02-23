/* global jQuery, rivets, startGame */
(function($, rivets, startGame) {
    var scope = {},
        app = $('#home'),
        stage = app.find('#cr-stage');

    scope.playGame = function() {
        $(this).fadeOut(function() {
            stage.animate({height: '600px'}, 300, function() {
                startGame();
            });
            $('html, body').animate({
                scrollTop: stage.offset().top
            }, 700);
        });
    };
    rivets.bind(app, scope);
    setTimeout(function() {
        stage.css({'height': '300px'});
        stage.slideDown('slow');
    }, 300);
}(jQuery, rivets, startGame));