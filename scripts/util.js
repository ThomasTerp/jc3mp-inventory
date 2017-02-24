"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mod(number, mod) {
    return ((number % mod) + mod) % mod;
}
exports.mod = mod;
;
function rotateMatrix(matrix, direction) {
    direction = mod(direction, 360) || 0;
    var transpose = function (m) {
        var result = new Array(m[0].length);
        for (var i = 0; i < m[0].length; i++) {
            result[i] = new Array(m.length - 1);
            for (var j = m.length - 1; j > -1; j--) {
                result[i][j] = m[j][i];
            }
        }
        return result;
    };
    var reverseRows = function (m) {
        return m.reverse();
    };
    var reverseCols = function (m) {
        for (var i = 0; i < m.length; i++) {
            m[i].reverse();
        }
        return m;
    };
    var rotate90Left = function (m) {
        m = transpose(m);
        m = reverseRows(m);
        return m;
    };
    var rotate90Right = function (m) {
        m = reverseRows(m);
        m = transpose(m);
        return m;
    };
    var rotate180 = function (m) {
        m = reverseCols(m);
        m = reverseRows(m);
        return m;
    };
    if (direction == 90 || direction == -270) {
        return rotate90Left(matrix);
    }
    else if (direction == -90 || direction == 270) {
        return rotate90Right(matrix);
    }
    else if (Math.abs(direction) == 180) {
        return rotate180(matrix);
    }
    return matrix;
}
exports.rotateMatrix = rotateMatrix;
;
function cloneObject(objectToClone) {
    var objectClone = (objectToClone instanceof Array) ? [] : {};
    for (var index in objectToClone) {
        if (index == 'clone') {
            continue;
        }
        if (objectToClone[index] && typeof objectToClone[index] == "object") {
            objectClone[index] = cloneObject(objectToClone[index]);
        }
        else {
            objectClone[index] = objectToClone[index];
        }
    }
    return objectClone;
}
exports.cloneObject = cloneObject;
;
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
;
