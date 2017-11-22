import React, {Component} from 'react';
import {initShaderProgram, initBuffers} from '../utils/webgl-utils';
import {mat4} from 'gl-matrix';

import vSource from '../../shaders/vert.glsl';
import fSource from '../../shaders/frag.glsl';

const canvasStyle = {
    width: "640px",
    height: "480px",
    borderStyle: "solid"
};

class App extends Component {

    start () {

        console.log('starting');

        const canvas = document.getElementById('canvas');
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
            },
            uniformLocations: {
              modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
              projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
            },
        };

        const buffers = initBuffers(gl);

        this.drawScene(gl, programInfo, buffers);

    }

    drawScene (gl, programInfo, buffers) {

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

        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        {
            //  Pull positions from buffer into vertexPosition attribute
            const numComponents = 2;
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

        //  Use program
        gl.useProgram(programInfo.program);

        console.log(projectionMatrix);

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

        {
            console.log('drawing');
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
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
