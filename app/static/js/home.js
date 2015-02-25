/* global _, jQuery, rivets, moment */

(function(global, $, rivets, engine) {
    'use strict';
    var app = $('#home'),
        stage = app.find('#cr-stage'),
        cover = stage.find('#frontCover'),
        domArmies = $('#armies li'),
        armyColors = ['red', 'blue'],
        myArmy = localStorage.getItem('myArmy'),
        scope;

    function initApp() {
        if (myArmy) {
            var li = $('#armies li[data-army-id=' + myArmy + ']');
            li.find('a')
                    .addClass('active ' + armyColors[0]);
            li.prependTo('#armies');
        }
        setTimeout(function() {
            stage.css({'height': '300px'});
            stage.slideDown('slow');
        }, 300);
    }
    function initRivets() {
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
    }
    scope = {
        title: 'Random Fight',
        today: moment().format('DD-MM-YY'),
        selectedArmies: myArmy ? [myArmy] : [],
        armies: domArmies.map(function(i,el) {
            return el.getAttribute('data-army-id')}),
        playGame: function() {
            if (scope.selectedArmies.length < 2) {
                scope.selectedArmies = _.sample(scope.armies, 2);
                scope.title = scope.selectedArmies[0] + ' -vs- ' +
                              scope.selectedArmies[1];
            }
            engine.init();
            scope.playing = true;
        },
        submitFile: function(event) {
            var target = event.target,
                form = target.parentNode.parentNode;
            if (target.files.length) {
                if (target.files[0].name.search(/\.js$/) > 0) {
                    localStorage.setItem('myArmy', target.files[0]
                                                .name.replace(/\.js$/, ''));
                    form.submit();
                    return;
                }
                alert('Not a javascript file');
            }
        },
        selectArmyToBattle: function(e) {
            var target = e.currentTarget.parentNode,
                armies = scope.selectedArmies;
            e.preventDefault();
            armies.push($(target).data('army-id'));
            if (armies.length === 3) {
                armies.shift();
            }
            if (armies.length === 2) {
                scope.title = armies[0] + ' -vs- ' + armies[1];
            }
            domArmies.each(function(i, el) {
                $(el).find('a').removeClass('active red blue');
            });
            armies.forEach(function(army, i) {
                $('#armies li[data-army-id=' + army + '] a')
                    .addClass('active ' + armyColors[i]);
            });
        }
    };
    initRivets();
    initApp();
    global.scope = scope;
}(window, jQuery, rivets, window.engine));