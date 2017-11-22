import React, {Component} from 'react';
import {initShaderProgram} from '../utils/webgl-utils';
import {vec4} from 'gl-matrix';

import vSource from '../../shaders/vert.glsl';
import fSource from '../../shaders/frag.glsl';

const canvasStyle = {
    width: "640px",
    height: "480px"
};

class App extends Component {
    
    start () {

        console.log('starting');

        const canvas = document.getElementById('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {

            alert('Unable to initialize WebGL. Your browser may not support it.');

        }

        gl.clearColor(1.0, 0.0, 0.0, 1.0);

        gl.enable(gl.DEPTH_TEST);

        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const shaderProgram = initShaderProgram(gl, vSource, fSource);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'vPosition'),
            },
            uniformLocations: {
              modelMatrix: gl.getUniformLocation(shaderProgram, 'model'),
              viewMatrix: gl.getUniformLocation(shaderProgram, 'view'),
              perspectiveMatrix: gl.getUniformLocation(shaderProgram, 'perspective')
            },
        };

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

        mat4.perspective(projectionMatrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar);

        const modelViewMatrix = mat4.create();
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
