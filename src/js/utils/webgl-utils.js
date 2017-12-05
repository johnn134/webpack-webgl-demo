/**
 * webgl-utils.js
 * 
 * Utility functions for webgl
 */

import cubePositions from '../../obj/cube';

/**
 * Initializes a shader program from the given fragment and vertex shaders
 * @param {Context} gl 
 * @param {String} vSource 
 * @param {Strng} fSource 
 */
const initShaderProgram = (gl, vSource, fSource) => {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {

        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        
        return null;

    }

    return shaderProgram;

};

/**
 * Creates a shader of the given type, uploads the source and compiles it
 * @param {Context} gl webgl context
 * @param {Type} type shader type
 * @param {String} source shader source string
 */
const loadShader = (gl, type, source) => {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        
        gl.deleteShader(shader);

        return null;

    }

    return shader;

};

/**
 * Create and return buffer
 * @param {Context} gl webgl context
 * @returns {Object} buffer
 */
const initBuffers = gl => {

    //  Positions
   const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(cubePositions),
                  gl.STATIC_DRAW);

    // Colors
    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];

    var colors = [];

    for (let j = 0; j < faceColors.length; j++) {
        const c = faceColors[j];

        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(colors),
                  gl.STATIC_DRAW);

    //  Indices
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(indices),
                  gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer
    };

};

export { initShaderProgram, initBuffers };
