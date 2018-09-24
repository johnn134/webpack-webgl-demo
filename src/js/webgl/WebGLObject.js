let uniqueID = 0;

class WebGLObject {

    meshData
    material;
    position;
    rotation;
    scale;
    ID;
    name;

    constructor(meshData, name) {

        this.meshData = meshData;

        this.position = [0, 0, 0];

        this.rotation = [0, 0, 0];

        this.scale = [1, 1, 1];

        this.ID = uniqueID;
        uniqueID++;

        this.name = name ? name : `OBJECT_${this.ID}`

    }

    translate = (x, y, z) => {

        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;

    };

}

export default WebGLObject;
