
const HEADER_KEYS = {
    'PROPERTY': 'property',
    'FORMAT': 'format',
    'ELEMENT': 'element',
    'COMMENT': 'comment',
    'END_HEADER': 'end_header',
    'PLY': 'ply'
};
const ELEMENT_TYPES = {
    'VERTEX': 'vertex',
    'LIST': 'list'
}

class ObjectFileParser {}

ObjectFileParser.parseObjFile = contents => {};

ObjectFileParser.parsePlyFile = (filename, contents) => {

    const splitAndTrim = (arr, delimiter=' ') => arr.split(delimiter).map(element => element.trim());

    const lines = splitAndTrim(contents, '\n').filter(line => splitAndTrim(line)[0] !== HEADER_KEYS.COMMENT);

    const headerEndLineNumber = lines.indexOf(HEADER_KEYS.END_HEADER)

    const header = lines.slice(0, headerEndLineNumber);
    const body = lines.slice(headerEndLineNumber + 1, lines.length);

    const plyObject = {
        'filename': filename,
        'format': {},
        'elements': []
    };

    //  Header values
    header.forEach((line, index) => {

        const lineElements = splitAndTrim(line);

        if (index === 0 && line !== HEADER_KEYS.PLY) {

            throw new Error(`parsePlyFile: Failed to match ply format: ${filename}`);

        }

        switch(lineElements[0]) {

        case HEADER_KEYS.FORMAT:
            plyObject.format[lineElements[1]] = lineElements[2]
            break;
        case HEADER_KEYS.ELEMENT:
            //  Get element properties
            const properties = {
                'type': null,
                'dataType': null,
                'props': null
            };

            const firstElementProperties = splitAndTrim(header[index + 1]);

            if (firstElementProperties[1] === ELEMENT_TYPES.LIST) {

                properties.type = ELEMENT_TYPES.LIST;
                properties.dataType = firstElementProperties[3];
                properties.props = firstElementProperties[4];

            } else {

                properties.type = ELEMENT_TYPES.VERTEX;
                properties.dataType = firstElementProperties[1];
                properties.props = [];

                let counter = index + 1;
                while(counter < header.length - 1 && splitAndTrim(header[counter])[0] === HEADER_KEYS.PROPERTY) {

                    properties.props.push(splitAndTrim(header[counter])[2])

                    counter++;

                }

            }

            //  Add element type to object
            plyObject.elements.push({
                'name': lineElements[1],
                properties,
                'entries': [],
                'count': parseInt(lineElements[2], 10)
            });
            break;
        default:

        }

    });

    //  Body values
    let elementCounter = 0;
    let entriesCounter = 0;

    for (let i = 0; i < body.length; i++) {

        entriesCounter++;

        const lineElements = splitAndTrim(body[i]);

        const currentElement = plyObject.elements[elementCounter];

        const startingIndex = currentElement.properties.type === ELEMENT_TYPES.LIST ? 1 : 0;

        const entry = lineElements.slice(startingIndex, lineElements.length);

        currentElement.entries.push(entry);

        if (currentElement.count === entriesCounter) {

            elementCounter++;
            entriesCounter = 0;

        }

        if (plyObject.elements.length <= elementCounter) {

            break;

        }

    }

    //  We need to parse element entries for their typed values
    const parseValueForType = (value, type) => {

        switch(type) {
        case 'int32':
            return parseInt(value, 10);
        case 'float32':
            return parseFloat(value);
        default:
            return value;
        }

    };

    plyObject.elements.forEach((element, index) => {

        plyObject.elements[index].entries = element.entries.map(entry => 
            entry.map(value => 
                parseValueForType(value, element.properties.dataType)
            )
        );

    });

    return plyObject;

}

export default ObjectFileParser;
