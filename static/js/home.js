/* global jQuery, rivets, startGame */
(function(window, $, rivets, startGame) {
    var scope = {
            title: 'Random Fight'
        },
        app = $('#home'),
        stage = app.find('#cr-stage'),
        cover = stage.find('#frontCover');

    scope.loadState = function() {
        scope.playing = true;
    };
    rivets.binders['play-game'] = function(el, value) {
        if (value) {
            cover.fadeOut(function() {
                stage.animate({height: '600px'}, 300, function() {
                    startGame();
                });
                $('html, body').animate({
                    scrollTop: stage.offset().top
                }, 700);
            });
        }
        else {
            stage.animate({height: '300px'}, 300, function() {
                cover.fadeIn(function() {
                    //clearStage();
                });
            });
        }
    };
    rivets.bind(app, scope);

    setTimeout(function() {
        stage.css({'height': '300px'});
        stage.slideDown('slow');
    }, 300);

    window.scope = scope;
}(window, jQuery, rivets, startGame));