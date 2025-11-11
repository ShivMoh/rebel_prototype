const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline');
const map = require('./componentMap');

// find element
// check if element is a child element
// if yes, add child element to previous element
// if not, add element at top layer

function isChildElement(tabCount) {
    if (tabCount > 0) return true;
    return false;
}

async function getElements() {
    console.log("I am rendering the elements");
    const directory_path = './test';
    const promises = [];

    const files = await fs.promises.readdir(directory_path);

    for (const file of files) {
        const file_path = path.join(directory_path, file);
        var counter = 0;

        const read_interface = readline.createInterface({
            input: fs.createReadStream(file_path),
            output: null,
            console: false
        });

        await new Promise((resolve) => {
            read_interface.on('line', async (line) => {
                const elementName = line.replaceAll(' ', '');
                const tabCount = line.match(/^\t+/);
                 
                if (map.has(elementName)) {
                    var element = await map.get(elementName).createElement(); // store the Promise
                    promises.push(element);
                }
                
               
            });

            read_interface.on('close', resolve);
        });
    }

    console.log('hello')
    const elements = promises; // ✅ wait for all to finish
    return elements;
}

module.exports = { getElements };
