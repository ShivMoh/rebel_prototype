const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline');
const map = require('./componentMap');
const { parseArgs } = require('node:util');
const { parseFormFields } = require('./formBuilder');

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
  console.log('html element', html_element);
  var split = html_element.split('<!--SPLIT-->');
  var node = new Node(Math.random() * 10, split[0], split[1]);

  // this means its the first for this depth
  if (last_inserted_depth.length - 1 < depth) {
    last_inserted_depth.push(node);
  } else {
    // we update rather than push a new node
    last_inserted_depth[depth] = node;
  }

  if (depth != 0) {
    // we add the node as a child to the previous node at the immediate higher depth
    (last_inserted_depth[depth - 1]).addChild(node);
  }

  return node;
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
    if (!file.includes('.rbl')) continue; // for now lets just parse the .rbl files

    const file_path = path.join(directory_path, file);
    const file_content = await fs.promises.readFile(file_path, { encoding: 'utf-8' });
    var elements = file_content.split(';');
    var script_name = '';


    for (const element of elements) {
      // this is for reading the script file
      if (element.charAt(0) == '%') {
        script_name = element.replaceAll('%script=', '');
        console.log('The script name is', script_name);
      } else {

        const tab_count = element.split(':').length - 1; // this is the depth
        const element_name = element.replaceAll(':', '').replaceAll('\n', '');

        if (map.has(element_name)) {
          var html_element = await map.get(element_name).createElement();
          parseHtmlIntoTree(html_element, tab_count);
        } else {
          // this is where we will build the form
          var form_string = await parseFormFields(element_name, script_name);
          parseHtmlIntoTree(form_string, tab_count);
        }
      }

    }

  }

  // construct the html string;
  constructElements(last_inserted_depth[0]);
  // printTree(last_inserted_depth[0]);

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

function reset() {
  html_string += '';
}

module.exports = { parseElements, reset };
