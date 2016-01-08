$(function() {
    var viewport = $('#tetris');
    var rotation = {
        start: {},
        matrix: matrixMltpl(getRotatitonMatrix('x', 30), getRotatitonMatrix('y', 20))
    };
    viewport.css('transform', 'matrix3d(' + rotation.matrix + ')');

    initTetris();
    initContainerRotation();
    initControls();

    // Get tetris results
    function initTetris() {
        var blocks = [
            '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 0 1 | 1 0 1 |  0 1 1 | 1 1 1',
            '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 0 1 | 1 0 1 |  0 1 1 | 1 1 1',
            '0 0 0 | 1 0 0 | 1 1 0 | 1 2 0 |  0 0 1 | 1 0 1 |  1 1 1 | 1 2 1',
            '0 0 0 | 1 0 0 | 1 1 0 | 1 2 0 |  0 0 1 | 1 0 1 |  1 1 1 | 1 2 1',
            '0 0 0 | 1 0 0 | 1 1 0 | 1 2 0 |  0 0 1 | 1 0 1 |  1 1 1 | 1 2 1',
            '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 1 1 | 0 1 2 |  0 2 1 | 0 2 2',
            '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 1 1 | 0 1 2 |  0 2 1 | 0 2 2',
            '0 0 0 | 1 0 0 | 0 1 0 | 1 1 0 |  0 1 1 | 0 1 2 |  0 2 1 | 0 2 2',
        ];

        var n = 4;
        var container = tetris3d(blocks, n);

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                for (var k = 0; k < n; k++) {
                    var cube = $('<div/>')
                        .addClass('cube block-' + container[i][j][k] + ' z-' + i + ' y-' + j + ' x-' + k);
                    for (var l = 0; l < 6; l++) {
                        $('<div/>').appendTo(cube);
                    }
                    cube.appendTo(viewport);
                }
            }
        }

        for (var i = 0; i < blocks.length; i++) {
            viewport.addClass('block-' + i);
        }
    }

    // Initialize buttons to control tetris blocks visibility
    function initControls() {
        var buttonsContainer = $('#controls');
        for (var i = 0; i < 8; i++) {
            $('<button/>').data('class-toggle', 'block-' + i)
                .addClass('block-' + i + ' active')
                .appendTo(buttonsContainer);
        }

        $('#controls button').on('click', function() {
            viewport.toggleClass($(this).data('class-toggle'));
            $(this).toggleClass('active');
        })
    }

    // Add event listeners to implement tetris rotation
    function initContainerRotation() {
        $(document).on('mousedown.rotation', function(e) {
            rotation.start.x = e.pageX;
            rotation.start.y = e.pageY;

            $(document).on('mousemove.rotation', function(e) {
                e.preventDefault();

                var xMatrix = getRotatitonMatrix('x', -(rotation.start.y - e.pageY) / 4);
                var yMatrix = getRotatitonMatrix('y', (rotation.start.x - e.pageX) / 4);
                rotation.matrix = matrixMltpl(matrixMltpl(rotation.matrix, xMatrix), yMatrix);

                viewport.css('transform', 'matrix3d(' + rotation.matrix + ')');

                rotation.start.x = e.pageX;
                rotation.start.y = e.pageY;
            });

            $(document).on('mouseup.rotation', function(e) {
                $(document).off('mousemove.rotation');
            })
        });
    }

    // Matrix multiplication
    function matrixMltpl(a, b) {
        var result = []
        for (var i = 0; i < a.length; i++) {
            result[i] = [];
            for (var j = 0; j < b[0].length; j++) {
                result[i][j] = 0;
                for (var k = 0; k < b.length; result[i][j] += a[i][k] * b[k][j], k++);
            }
        }

        return result;
    }

    // Returns rotation matrix around x or y axis by angle
    function getRotatitonMatrix(axis, angle) {
        angle = Math.PI / 180 * angle;

        switch (axis) {
            case 'x': 
                matrix = [
                    [1, 0, 0, 0],
                    [0, Math.cos(angle), -Math.sin(angle), 0],
                    [0, Math.sin(angle), Math.cos(angle), 0],
                    [0, 0, 0, 1]
                ];
                break;

            case 'y':
                matrix = [
                    [Math.cos(angle), 0, Math.sin(angle), 0],
                    [0, 1, 0, 0],
                    [-Math.sin(angle), 0, Math.cos(angle), 0],
                    [0, 0, 0, 1]
                ];
                break;
        }

        return matrix;
    }

    // Get matrix string representation
    function matrixToString(matrix) {
        for (var i = 0, result = []; i < matrix.length; result.push(matrix[i].join(',')), i++) ;
        return result.join(',');
    }
});