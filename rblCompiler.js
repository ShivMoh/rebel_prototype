const fs = require('node:fs')
const path = require('node:path')
const readline = require('readline')
const map = require('./componentMap')

function sayHello() {
    console.log("I am saying hello");
}

async function getElements() {
    console.log("I am rendering the elements");
    const directory_path = './test';
    const elements = [];

    const files = await fs.promises.readdir(directory_path);

    for (const file of files) {
        const file_path = path.join(directory_path, file);

        const read_interface = readline.createInterface({
            input: fs.createReadStream(file_path),

            output: null,
            console: false
        });

        // Wrap readline processing in a Promise
        await new Promise((resolve) => {
            read_interface.on('line', (line) => {
                const element = line.replaceAll(' ', '');
                if (map.has(element)) {
                    elements.push(map.get(element).createElement());
                }
            });

            read_interface.on('close', resolve);
        });
    }

    return elements;
}

module.exports = { getElements };
