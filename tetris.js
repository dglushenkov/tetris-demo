function tetris3d(blocks, n) {

    return run(blocks, n);

    // Rotate point around axis by andle
    function rotatePoint(p, axis, angle) {
        angle = Math.PI / 180 * angle;

        switch (axis) {
            case 'x':
                matrix = [
                    [1, 0, 0],
                    [0, Math.round(Math.cos(angle)), -Math.round(Math.sin(angle))],
                    [0, Math.round(Math.sin(angle)), Math.round(Math.cos(angle))]
                ];
                break;
            case 'y':
                matrix = [
                    [Math.round(Math.cos(angle)), 0, Math.round(Math.sin(angle))],
                    [0, 1, 0],
                    [-Math.round(Math.sin(angle)), 0, Math.round(Math.cos(angle))]
                ];
                break;
            case 'z':
                matrix = [
                    [Math.round(Math.cos(angle)), -Math.round(Math.sin(angle)), 0],
                    [Math.round(Math.sin(angle)), Math.round(Math.cos(angle)), 0],
                    [0, 0, 1]
                ];
                break;
        }

        for (var i = 0, result = []; i < 3; i++) {
            result[i] = 0;
            for (var j = 0; j < 3; result[i] += matrix[i][j] * p[j], j++);
        }

        return result;
    }

    // Retrieve block points coordinates from strings
    function parseBlocks(blocks) {
        var result = [];
        for (var i = 0; i < blocks.length; i++) {
            result[i] = blocks[i].split(/\s+\|\s+/);
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = result[i][j].split(/\s/);
            }
        }

        return result;
    }

    // Rotate block around axis by andle
    function rotateBlock(block, axis, angle) {
        for (var i = 0, result = []; i < block.length; i++) {
            result[i] = rotatePoint(block[i], axis, angle);
        }

        // Sort block points by Z, Y, X coordinates
        result.sort(function(p1, p2) {
            for (var i = 2; i >= 0; i--) {
                if (p1[i] != p2[i]) {
                    return p1[i] - p2[i];
                }
            }
            return 0;
        });

        // Shift all block points so that first point has coordinates (0, 0, 0)
        var shift = result[0].slice();
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < 3; result[i][j] += -shift[j], j++);
        }

        return result;
    }

    // Get all possible block turning/rotating variants
    function getBlockVariants(block) {
        var blockVariants = [];
        var variantHashes = [];
        var turns = [
            { axis: 'y', angle: 0 },
            { axis: 'y', angle: 90 },
            { axis: 'y', angle: -90 },
            { axis: 'y', angle: 180 },
            { axis: 'x', angle: 90 },
            { axis: 'x', angle: -90 }
        ];
        var rotates = [90, -90, 180];

        for (var i = 0; i < turns.length; i++) {
            var blockTurn = rotateBlock(block, turns[i].axis, turns[i].angle);
            var variantHash = getBlockVariantHash(blockTurn);
            if (variantHash in variantHashes) continue;

            variantHashes[variantHash] = true;
            blockVariants.push(blockTurn);

            for (var j = 0; j < rotates.length; j++) {
                var blockRotate = rotateBlock(blockTurn, 'z', rotates[j]);
                var variantHash = getBlockVariantHash(blockRotate);
                if (variantHash in variantHashes) continue;

                variantHashes[variantHash] = true;
                blockVariants.push(blockRotate);
            }
        }

        return blockVariants;
    }

    // Get string representation of block variant
    function getBlockVariantHash(blockVariant) {
        for (var i = 0, result = []; i < blockVariant.length; result[i] = blockVariant[i].join(' '), i++);
        return result.join('|');
    }

    // Try to insert block with label into container at point
    // Returns true if success, otherwise returns false;
    function insertBlock(container, block, label, point) {
        for (var i = 0, blockPoints = []; i < block.length; i++) {
            for (var j = 0, blockPoint = []; j < 3; j++) {
                var coordinate = point[j] + block[i][j];
                if (coordinate >= container.length || coordinate < 0) return false;

                blockPoint[j] = coordinate;
            }

            if (container[blockPoint[2]][blockPoint[1]][blockPoint[0]] != null) return false;

            blockPoints.push(blockPoint);
        }
        
        for (var i = 0; i < blockPoints.length; i++) {
            var point = blockPoints[i];
            container[point[2]][point[1]][point[0]] = label;
        }

        return true;
    }

    // Delete block from container at point
    function deleteBlock(container, block, point) {
        for (var i = 0; i < block.length; i++) {
            var x = point[0] + block[i][0],
                y = point[1] + block[i][1],
                z = point[2] + block[i][2];
            container[z][y][x] = null;
        }
    }

    // Main function
    function run(blocks, n) {
        // Parse blocks from strings
        blocks = parseBlocks(blocks);

        // Check if blocks could fully fill the container
        for (var i = 0, pointsCount = 0; i < blocks.length; pointsCount += blocks[i].length, i++);
        if (pointsCount != n * n * n) throw new Error('Total blocks count is not equal to container size');

        // Get all blocks possible rotates and turns
        for (var i = 0; i < blocks.length; i++) {
            blocks[i] = getBlockVariants(blocks[i]);
        }

        // Init container with nulls
        for (var i = 0, container = []; i < n; i++) {
            container[i] = [];
            for (var j = 0; j < n; j++) {
                container[i][j] = [];
                for (var k = 0; k < n; k++) {
                    container[i][j][k] = null;
                }
            }
        }

        return (findBlockToInsert(container, blocks, [], [0, 0, 0])) ? container : false;
    }

    // Recursive function to find and insert next block into container at point
    function findBlockToInsert(container, blocks, usedBlocks, point) {
        // Loop through all unused blocks
        for (var i = 0; i < blocks.length; i++) {
            if (~$.inArray(i, usedBlocks)) continue;

            // Loop through all block turns and rotations
            var blockVariants = blocks[i];
            for (var j = 0; j < blockVariants.length; j++) {
                // Insert block into container if we can
                if (insertBlock(container, blockVariants[j], i, point)) {
                    usedBlocks.push(i);

                    // If there are not unused blocks left - success
                    if (usedBlocks.length == blocks.length) {
                        return true;

                    } else {
                        // Else try to find new block to insert into next free point in container
                        var newPoint = findEmptyPoint(container, point);
                        var result = findBlockToInsert(container, blocks, usedBlocks, newPoint);

                        // If there are not success - delete inserted block from container
                        if (!result) {
                            deleteBlock(container, blockVariants[j], point);
                            usedBlocks.pop();
                        } else {
                            return true;
                        }
                    }
                }
            }
        }
    }

    // Find free point in container to insert block into
    function findEmptyPoint(container, point) {
        var x = point[0],
            y = point[1],
            z = point[2],
            n = container.length;

        for (; z < n; y = 0, z++) {
            for (; y < n; x = 0, y++) {
                for (; x < n; x++) {
                    if (container[z][y][x] == null) return [x, y, z];
                }
            }
        }
    }
}