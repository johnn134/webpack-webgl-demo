import React, {Component} from 'react';

import WebGLEnvironment from '../webgl/WebGLEnvironment';

import vSource from '../../shaders/flat_shading/vert.glsl';
import fSource from '../../shaders/flat_shading/frag.glsl';

import cubePLY from '../../ply/cube.ply';
import teapotPLY from '../../ply/teapot.ply';
import airplanePLY from '../../ply/airplane.ply';
import pyramidSimplePLY from '../../ply/pyramid_simple.ply';
import pyramidComplexPLY from '../../ply/pyramid_complex.ply';

import cubeOBJ from '../../obj/cube.obj';

import cubeImage from '../../images/cubetexture.png';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const MIN_FOV = 1;
const MAX_FOV = 180;
const DEFAULT_FOV = 45;

const canvasStyle = {
    width: `${CANVAS_WIDTH}px`,
    height: `${CANVAS_HEIGHT}px`,
    borderStyle: "solid"
};

class App extends Component {

    constructor(props) {

        super(props);

        this.state = {
            'fovSliderValue': DEFAULT_FOV,
            'rot': {
                'x': 0,
                'y': 0,
                'z': 0
            },
            'pos': {
                'x': 0,
                'y': 0,
                'z': 0
            },
            'scale': {
                'x': 1,
                'y': 1,
                'z': 1
            },
        };

        this.canvasRef = React.createRef();
        this.fovRef = React.createRef();
        this.rotRef = React.createRef();
        this.posRef = React.createRef();

    }

    componentDidMount () {

        const canvas = this.canvasRef.current;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const {OBJECT_FILE_FORMATS} = WebGLEnvironment;

        const pyramidSimple =  {
            'filename': 'pyramid_simple.ply',
            'contents': pyramidSimplePLY,
            'format': OBJECT_FILE_FORMATS.PLY
        };

        const pyramidComplex =  {
            'filename': 'pyramid_complex.ply',
            'contents': pyramidComplexPLY,
            'format': OBJECT_FILE_FORMATS.PLY
        };

        const teapot = {
            'filename': 'teapot.ply',
            'contents': teapotPLY,
            'format': OBJECT_FILE_FORMATS.PLY
        };

        const airplane = {
            'filename': 'airplane.ply',
            'contents': airplanePLY,
            'format': OBJECT_FILE_FORMATS.PLY
        };

        const environment = new WebGLEnvironment({
            canvas,
            'objectFiles': [
                airplane
            ],
            'images': [cubeImage],
            'shaders': [
                {
                    'name': 'Flat Shading',
                    'vertex': vSource,
                    'fragment': fSource
                }
            ]
        });

        environment.addObject('airplane.ply');

        environment.start();

        this.environment = environment;

    }

    updateFOV = event => {

        const {value} = event.target;

        this.environment.updateFOV(value);
        this.setState({'fovSliderValue': value});

    }

    updatePOS = (axis, event) => {

        const {value} = event.target;

        this.environment.updatePOS(axis, value);

        let cpy = this.state.pos;
        cpy[axis] = value;
        this.setState({'pos': cpy});

    }

    updateROT = (axis, event) => {

        const {value} = event.target;

        this.environment.updateROT(axis, value);

        let cpy = this.state.rot;
        cpy[axis] = value;
        this.setState({'rot': cpy});

    }

    updateSCALE = (axis, event) => {

        const {value} = event.target;

        this.environment.updateSCALE(axis, value);

        let cpy = this.state.scale;
        cpy[axis] = value;
        this.setState({'scale': cpy});

    }

    render () {

        return (
            <div>
                <p>WebGL Demo</p>
                <canvas id="canvas" style={canvasStyle} ref={this.canvasRef}/>
                <div>
                    FOV ANGLE: 
                    <input
                        type="range"
                        min={MIN_FOV}
                        max={MAX_FOV}
                        value={this.state.fovSliderValue}
                        onChange={this.updateFOV}
                        ref={this.fovRef}
                    />
                </div>
                <div>
                    Position: 
                    <input
                        type="number"
                        value={this.state.pos.x}
                        onChange={evt => this.updatePOS('x', evt)}
                        ref={this.posRef}
                    />
                    <input
                        type="number"
                        value={this.state.pos.y}
                        onChange={evt => this.updatePOS('y', evt)}
                        ref={this.posRef}
                    />
                    <input
                        type="number"
                        value={this.state.pos.z}
                        onChange={evt => this.updatePOS('z', evt)}
                        ref={this.posRef}
                    />
                </div>
                <div>
                    Rotation: 
                    <input
                        type="number"
                        value={this.state.rot.x}
                        onChange={evt => this.updateROT('x', evt)}
                        ref={this.rotRef}
                    />
                    <input
                        type="number"
                        value={this.state.rot.y}
                        onChange={evt => this.updateROT('y', evt)}
                        ref={this.rotRef}
                    />
                    <input
                        type="number"
                        value={this.state.rot.z}
                        onChange={evt => this.updateROT('z', evt)}
                        ref={this.rotRef}
                    />
                </div>
                <div>
                    Scale: 
                    <input
                        type="number"
                        value={this.state.scale.x}
                        onChange={evt => this.updateSCALE('x', evt)}
                        ref={this.scaleRef}
                    />
                    <input
                        type="number"
                        value={this.state.scale.y}
                        onChange={evt => this.updateSCALE('y', evt)}
                        ref={this.scaleRef}
                    />
                    <input
                        type="number"
                        value={this.state.scale.z}
                        onChange={evt => this.updateSCALE('z', evt)}
                        ref={this.scaleRef}
                    />
                </div>
            </div>
        );

    }

}

export default App;
