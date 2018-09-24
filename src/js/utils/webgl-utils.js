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
const initBuffers = (gl, meshes) => {

    meshes.forEach((mesh, i) =>

        mesh.elements.forEach((element, j) => {

            const buf = gl.createBuffer();

            const bufferType = element.properties.type === 'list'
                ? gl.ELEMENT_ARRAY_BUFFER
                : gl.ARRAY_BUFFER;

            const entries = flattenElementEntries(element);

            console.log(entries);

            gl.bindBuffer(bufferType, buf);
            gl.bufferData(
                bufferType,
                entries,
                gl.STATIC_DRAW
            );

            meshes[i].elements[j].buffer = buf;

        })

    );

};

const flattenElementEntries = element => {

    let flattenedEntries = [];

    element.entries.forEach(entry => {

        const portion = entry.slice(0, entry.length);

        flattenedEntries = flattenedEntries.concat(portion);

    });

    switch (element.properties.dataType) {

    case 'float32':
        return new Float32Array(flattenedEntries);
    case 'int32':
        return new Uint32Array(flattenedEntries);
    default:
        return flattenedEntries;
    }

};

/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 * @param {Context} gl 
 * @param {string} url 
 */
const loadTexture = (gl, url) => {

    const texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);

    /**
     * Because images have to be download over the internet
     * they might take a moment until they are ready.
     * Until then put a single pixel in the texture so we can
     * use it immediately. When the image has finished downloading
     * we'll update the texture with the contents of the image.
     */
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);

    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
    );

    const image = new Image();

    image.onload = () => {

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image
        );

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {

            gl.generateMipmap(gl.TEXTURE_2D);

        } else {

            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
            );
            
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
            );

            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                gl.LINEAR
            );

        }

    };

    image.src = url;

    return texture;

};

const isPowerOf2 = value => {

    return (value & (value - 1)) === 0;

};

export { initShaderProgram, initBuffers, loadTexture };
