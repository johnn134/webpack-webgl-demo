import {
    initShaderProgram,
    initBuffers,
    loadTexture
} from '../utils/webgl-utils';
import {mat4} from 'gl-matrix';

import ObjectFileParser from './ObjectFileParser';
import WebGLObject from './WebGLObject';

const DEFAULT_FOV_ANGLE = 45;

let meshRotation = {
    'x': 0,
    'y': 0,
    'z': 0
};
let meshPos = {
    'x': 0,
    'y': 0,
    'z': 0
};
let meshScale = {
    'x': 1,
    'y': 1,
    'z': 1
};
let sceneObjectID = 0;

class WebGLEnvironment {

    constructor(params) {

        const {canvas, objectFiles, images, shaders} = params;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {

            alert('Unable to initialize WebGL. Your browser may not support it.');

        }

        //  Store canvas webgl context
        this.gl = gl;

        //  Initialize Camera FOV angle
        this.fovAngle = DEFAULT_FOV_ANGLE;

        //  initialize shader program
        const shaderProgram = initShaderProgram(gl, shaders[0].vertex, shaders[0].fragment);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
            },
            uniformLocations: {
              modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
              projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
            },
        };

        //  Create meshes from 3D Object files
        this.meshes = objectFiles.map(objectFile => {

            const {OBJECT_FILE_FORMATS} = WebGLEnvironment;

            const {contents, format, filename} = objectFile;

            let meshData;

            switch(format) {

            case OBJECT_FILE_FORMATS.PLY:
                meshData = ObjectFileParser.parsePlyFile(filename, contents);
                break;
            case OBJECT_FILE_FORMATS.OBJ:
                meshData = ObjectFileParser.parseObjFile(filename, contents);
                break;
            default:

            }

            return meshData;

        });

        this.sceneObjects = [];

        //  Initialize buffers
        initBuffers(gl, this.meshes);

        console.log(this.meshes);

    }

    addObject = (meshName, position=[0, 0, 0], rotation=[0, 0, 0], scale=[1, 1, 1]) => {

        this.sceneObjects.push({
            'meshData': this.meshes.find(element => element && element.filename === meshName),
            position,
            rotation,
            scale,
            'ID': sceneObjectID
        });

        sceneObjectID++;

    };

    updateFOV = val => {

        this.fovAngle = val;

    };

    updatePOS = (axis, val) => {

        meshPos[axis] = val;

    };

    updateROT = (axis, val) => {

        meshRotation[axis] = val;

    };

    updateSCALE = (axis, val) => {

        meshScale[axis] = val;

    };

    start = () => {

        let then = 0;

        const render = now => {

            now *= 0.001;
            const deltaTime = now - then;
            then = now;

            this.drawScene(deltaTime);

            requestAnimationFrame(render);

        }

        requestAnimationFrame(render);

    };

    drawScene = (deltaTime, gl=this.gl, programInfo=this.programInfo) => {

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //  Setup perspective camera
        const fieldOfView = this.fovAngle * Math.PI / 180;
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

        this.sceneObjects.forEach(obj => {

            //  Setup model matrix
            //  We additionally apply the view to it
            const modelViewMatrix = mat4.create();

            //  Translate object
            mat4.translate(modelViewMatrix,
                        modelViewMatrix,
                        [meshPos.x, meshPos.y, meshPos.z - 6]);

            //  Rotate object
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        meshRotation.x * Math.PI / 180,
                        [1, 0, 0]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        meshRotation.y * Math.PI / 180,
                        [0, 1, 0]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        meshRotation.z * Math.PI / 180,
                        [0, 0, 1]);

            //  Scale object
            mat4.scale(modelViewMatrix,
                modelViewMatrix,
                [meshScale.x, meshScale.y, meshScale.z]);

            //  Pull positions from buffer into vertexPosition attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.meshData.elements[0].buffer);

            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                3,
                gl.FLOAT,
                false,
                0,
                0
            );

            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.meshData.elements[1].buffer);

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

            const vertexCount = obj.meshData.elements[1].count * 3;

            var ext = gl.getExtension('OES_element_index_uint');
            const type = gl.UNSIGNED_INT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

        });

    };

    applyVertexAttribArray = (gl, numComponents, buffer, attribLocation) => {

        

    };
}

WebGLEnvironment.OBJECT_FILE_FORMATS = {
    'PLY': 'PLY',
    'OBJ': 'OBJ'
};

export default WebGLEnvironment;
