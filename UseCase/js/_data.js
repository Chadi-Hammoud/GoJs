var _data = [];

let numPortsString;
let numPorts;

export function setNumPortsString(value) {
    numPorts = parseInt(value);
    console.log(numPorts);
}

export { numPorts };

export function getNumPortsString() {
    console.log(numPorts);
    return numPorts;
}
