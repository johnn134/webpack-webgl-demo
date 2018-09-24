let uniqueID = 0;

class MeshData {

    meshData
    ID;

    constructor(meshData) {

        this.meshData = meshData;

        this.ID = uniqueID;
        uniqueID++;

    }

}

export default MeshData;
