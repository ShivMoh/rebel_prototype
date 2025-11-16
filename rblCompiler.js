const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline');
const map = require('./componentMap');
const { parseArgs } = require('node:util');

// this doesn't account for child elements
// it only places elements within each other 
// hopefully you remember what that means shivesh, yes you, I am you, fool, hahahahhahahahah
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
        var current_depth = 1;

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
                    
                    previous_tab_count = tab_count + 1; // we're doing this because we don't want the base element to change on 1 :
                    base_element = html_element;
                    element_build = html_element;
                } else {

                    // we only want it to change when its 2 :
                    if (tab_count > previous_tab_count) { 
                        previous_tab_count = tab_count; 
                        base_element = previous_element;
                        current_depth = tab_count;
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

var last_inserted_depth = []
html_string = '' // this is the final string output 

class Node {
    children = [];
    constructor(id, opening_tags, ending_tags) {
        this.id = id;
        this.opening_tags = opening_tags;
        this.ending_tags = ending_tags;
    }

    addChild(child) {
        this.children.push(child);
    }
}


function parseHtmlIntoTree(html_element, depth) {
    var split = html_element.split('<!--SPLIT-->');
    var node = new Node(Math.random() * 10, split[0], split[1]);

    // console.log("is this running?")
    // this means its the first for this depth
    if (last_inserted_depth.length - 1 < depth) {
        console.log("is this not running")
        last_inserted_depth.push(node);
    } else {
        // we update rather than push a new node
        last_inserted_depth[depth] = node;
    }

    if (depth != 0) {
        // we add the node as a child to the previous node at the immediate higher depth
        (last_inserted_depth[depth - 1]).addChild(node);
    }  
}  

// utilitiy function for printing the tree
function printTree(root) {
    console.log(root.opening_tags)
    if (root.children.length == 0) return;
    root.children.map((child, index) => {
        console.log(index);
        printTree(child);
    });
}

// parse through the rbl file and construct the html tree
async function parseElements() {
    const directory_path = './test';
    const files = await fs.promises.readdir(directory_path);
   
    for (const file of files) {
        const file_path = path.join(directory_path, file);
        const file_content = await fs.promises.readFile(file_path, {encoding: 'utf-8'});
        var elements = file_content.split('\n');
        console.log("elements", elements);

        for (const element of elements) {
            const tab_count = element.split(':').length - 1; // this is the depth
            const element_name = element.replaceAll(':', '');
    
            if (map.has(element_name)) {
                var html_element = await map.get(element_name).createElement(); 
                parseHtmlIntoTree(html_element, tab_count);
            }
           
        }
    }

    // construct the html string;
    constructElements(last_inserted_depth[0]);
    return html_string; // return the global string variable
}

// used to construct the html tree into a html string
function constructElements(root) {
    html_string += root.opening_tags;

    if (root.children.length < 0) return;

    root.children.map(child => {
        constructElements(child);
    });

    html_string += root.ending_tags;
}

module.exports = { getElements, parseElements };
