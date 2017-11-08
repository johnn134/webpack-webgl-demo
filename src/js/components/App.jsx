import React, {Component} from 'react';

const canvasStyle = {
    width: "640px",
    height: "480px",
    borderStyle: 'solid'
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
