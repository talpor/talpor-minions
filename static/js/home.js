/* global jQuery, rivets */

(function(global, $, rivets) {
    'use strict';
    var scope = {
            title: 'Random Fight',
            armies: []
        },
        app = $('#home'),
        stage = app.find('#cr-stage'),
        cover = stage.find('#frontCover');

    scope.loadState = function() {
        global.initEngine();
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
                stage.animate({height: '600px'}, 300, function() {
                    global.startGame();
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

    global.scope = scope;
}(window, jQuery, rivets));