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


async function getFileElements(files) {
    var promises = [];
    var newPromises = [];
    var directory_path = './test';

    for (const file of files) {
        const file_path = path.join(directory_path, file);
        var counter = 0;

        const read_interface = readline.createInterface({
            input: fs.createReadStream(file_path),
            output: null,
            console: false
        });

        await read_interface.on('line', async (line) => {
            const elementName = line.replaceAll(' ', '');
            const tabCount = line.match(/^\t+/);
                
            if (map.has(elementName)) {
                var element = await map.get(elementName).createElement(); // store the Promise
                console.log('element', element);
                promises.push(element);
            }
        });
    };

    console.log('hello test')
    return "testing";
}

async function getElements() {
    const directory_path = './test';
    const promises = [];
    const morePromises = [];
    const files = await fs.promises.readdir(directory_path);
    var ret_elements  = [];
    

    for(const file of files) {
        const file_path = path.join(directory_path, file);
        const file_content = await fs.promises.readFile(file_path, {encoding: 'utf-8'});
        var previous_element = "";
        var element_build = "";

        var elements = file_content.split('\n');

        for(const element of elements) {
            const tab_count = element.split(':').length - 1;
            const element_name = element.replaceAll(':', '');
            console.log(tab_count, element_name);
            if (map.has(element_name)) {
                var html_element = await map.get(element_name).createElement(); // store the Promise
                previous_element = html_element;
             
                if (tab_count == 0) {
                    
                    if (element_build != "") {
                        ret_elements.push(element_build);
                    }

                    element_build = html_element;
                    // console.log('html element', html_element);
                    // console.log("this is the base", element_build)
                } else {
                    var split = element_build.split('<!--SPLIT-->');
                    var insert_index = (split.length / 2);
                    // console.log('split', split.length, insert_index);
                    element_build = split.splice(insert_index, 0, html_element).join('<!--SPLIT-->');
                    // console.log("this is the element build", element_build, split);
                    element_build = split;
                }
            }

            ret_elements.push(element_build);
        }
    }

    console.log('ret elements', ret_elements);
    return ret_elements;
}

module.exports = { getElements };
