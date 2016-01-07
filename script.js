$(function() {
    var blocks = [
        '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 0 1 | 1 0 1 |  0 1 1 | 1 1 1',
        '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 0 1 | 1 0 1 |  0 1 1 | 1 1 1',
        '0 0 0 | 1 0 0 | 1 1 0 | 1 2 0 |  0 0 1 | 1 0 1 |  1 1 1 | 1 2 1',
        '0 0 0 | 1 0 0 | 1 1 0 | 1 2 0 |  0 0 1 | 1 0 1 |  1 1 1 | 1 2 1',
        '0 0 0 | 1 0 0 | 1 1 0 | 1 2 0 |  0 0 1 | 1 0 1 |  1 1 1 | 1 2 1',
        '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 | -1 1 1 | 0 1 1 | -1 1 2 | 0 1 2',
        '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 | -1 1 1 | 0 1 1 | -1 1 2 | 0 1 2',
        '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 | -1 1 1 | 0 1 1 | -1 1 2 | 0 1 2',
    ];

    var n = 4;
    var container = tetris3d(blocks, n);
    var viewport = $('#tetris-viewport');
    var rotation = {
        start: {},
        x: 0,
        y: 0,
    };

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            for (var k = 0; k < n; k++) {
                var cube = $('<div/>')
                    .addClass('cube block-' + container[i][j][k] 
                        + ' z-' + i + ' y-' + j + ' x-' + k);
                for (var l = 0; l < 6; l++) {
                    $('<div/>').appendTo(cube);
                }
                cube.appendTo(viewport);
            }
        }
    }

    $(document).on('mousedown', function(e) {
        rotation.start.x = e.pageX;
        rotation.start.y = e.pageY;

        $(document).on('mousemove', function(e) {
            e.preventDefault();

            rotation.x += parseInt((rotation.start.y - e.pageY) / 4);
            rotation.y -= parseInt((rotation.start.x - e.pageX) / 4);

            viewport.css('transform', 'rotateX(' + rotation.x + 
                'deg) rotateY(' + rotation.y + 'deg)');

            rotation.start.x = e.pageX;
            rotation.start.y = e.pageY;
        });

        $(document).on('mouseup', function(e) {
            $(document).off('mousemove');
        })
    });

    $('.buttons button').on('click', function() {
        viewport.toggleClass($(this).attr('class'));
        $(this).toggleClass('active');
    })
});