const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline');
const map = require('./componentMap');

// find element
// check if element is a child element
// if yes, add child element to previous element
// if not, add element at top layer
async function getElements() {
    const directory_path = './test';
    const files = await fs.promises.readdir(directory_path);
    var ret_elements = [];

    for(const file of files) {
        const file_path = path.join(directory_path, file);
        const file_content = await fs.promises.readFile(file_path, {encoding: 'utf-8'});
        var base_element = "";
        var element_build = "";
        var previous_tab_count = 0;

        var elements = file_content.split('\n');

        for(const element of elements) {
            const tab_count = element.split(':').length - 1;
            const element_name = element.replaceAll(':', '');
         
            if (map.has(element_name)) {
                var html_element = await map.get(element_name).createElement(); // store the Promise
                previous_element = html_element;
             
                if (tab_count == 0) {
                    if (element_build != "") {
                        ret_elements.push(element_build);
                    }
                    
                    previous_tab_count = tab_count + 1;
                    base_element = html_element;
                    element_build = html_element;
                } else {

                    if (tab_count > previous_tab_count) { 
                        previous_tab_count = tab_count; 
                        base_element = previous_element;
                    }

                    var split = element_build
                        .split('<!--SPLIT-->');
                    var insert_index = (split.length / 2);
                    element_build = split
                        .splice(insert_index, 0, html_element)
                        .join('<!--SPLIT-->');
                    element_build = split.join('<!--SPLIT-->');
                }
            }
        }

        ret_elements.push(element_build);
    }

    return ret_elements;
}

module.exports = { getElements };
