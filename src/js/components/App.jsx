import React, {Component} from 'react';
import {
    initShaderProgram,
    initBuffers,
    loadTexture
} from '../utils/webgl-utils';
import {mat4} from 'gl-matrix';

import vSource from '../../shaders/vert.glsl';
import fSource from '../../shaders/frag.glsl';

import cubeImage from '../../images/cubetexture.png';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const canvasStyle = {
    width: `${CANVAS_WIDTH}px`,
    height: `${CANVAS_HEIGHT}px`,
    borderStyle: "solid"
};

class App extends Component {

    constructor(props) {

        super(props);

        this.cubeRotation = 0.0;
        this.then = 0;

    }

    start () {

        console.log('starting');

        const canvas = document.getElementById('canvas');

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {

            alert('Unable to initialize WebGL. Your browser may not support it.');

        }

        //  initialize shader program
        const shaderProgram = initShaderProgram(gl, vSource, fSource);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
            },
            uniformLocations: {
              modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
              projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
              uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
            },
        };

        //  Initialize buffers
        const buffers = initBuffers(gl);

        // Load texture
        const texture = loadTexture(gl, cubeImage);

        const render = (now) => {

            now *= 0.001;
            const deltaTime = now - this.then;
            this.then = now;

            this.drawScene(gl, programInfo, buffers, texture, deltaTime);

            requestAnimationFrame(render);

        }

        requestAnimationFrame(render);

    }

    drawScene (gl, programInfo, buffers, texture, deltaTime) {

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar
        );

        const modelViewMatrix = mat4.create();

        //  Translate object
        mat4.translate(modelViewMatrix,
                       modelViewMatrix,
                       [-0.0, 0.0, -6.0]);

        //  Rotate object
        mat4.rotate(modelViewMatrix,
                    modelViewMatrix,
                    this.cubeRotation,
                    [0, 0, 1]);

        mat4.rotate(modelViewMatrix,
                    modelViewMatrix,
                    this.cubeRotation * .7,
                    [0, 1, 0]);

        {
            //  Pull positions from buffer into vertexPosition attribute
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );

            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition
            );
        }

        {
            //  Pull colors from buffer into vertexColor attribute
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);

            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );

            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord
            );
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        //  Use program
        gl.useProgram(programInfo.program);

        //  Set shader uniforms
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        // Activate and bind textures
        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        this.cubeRotation += deltaTime;

    }

    componentDidMount () {

        this.start();

    }

    render () {

        return (
            <div>
                <p>WebGL Demo</p>
                <canvas id="canvas" style={canvasStyle}/>
            </div>
        );

    }

}

export default App;
