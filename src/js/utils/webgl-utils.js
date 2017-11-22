/**
 * webgl-utils.js
 * 
 * Utility functions for webgl
 */

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

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(positions),
                  gl.STATIC_DRAW);

    return {
        position: positionBuffer
    };

};

export { initShaderProgram, initBuffers };
