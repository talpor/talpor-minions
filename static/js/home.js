/* global jQuery, rivets, moment */

(function(global, $, rivets, game) {
    'use strict';
    var scope = {
            title: 'Random Fight',
            today: moment().format('DD-MM-YY'),
            armies: []
        },
        app = $('#home'),
        stage = app.find('#cr-stage'),
        cover = stage.find('#frontCover');

    scope.loadState = function() {
        // loadState
        if (scope.armies.length < 2) {
            alert('Random fight not implemented :(');
            return;
        }
        game.initEngine();
        scope.playing = true;
    };
    scope.selectArmyToBattle = function(e) {
        e.preventDefault();
        var target = e.currentTarget; // TODO: backward compatibility
        scope.armies.push($(target).attr('data-army'));
        if (scope.armies.length === 3) {
            scope.armies.shift();
        }
        if (scope.armies.length === 2) {
            scope.title = scope.armies[0] + ' -vs- ' +
                          scope.armies[1];
        }
    };
    rivets.binders['play-game'] = function(el, value) {
        if (value) {
            cover.fadeOut(function() {
                stage.animate({height: '600px'}, 300);
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

    game.drawCanvas();
    setTimeout(function() {
        stage.css({'height': '300px'});
        stage.slideDown('slow');
    }, 300);

    global.scope = scope;
}(window, jQuery, rivets, window.game));