const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline');
const map = require('./componentMap');
const { parseArgs } = require('node:util');
const { parseFormFields } = require('./formBuilder');

var last_inserted_depth = []
var css_files = ['Layout.css']; // a global array of css files to parse as Link refs
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

// used to construct the html tree into a html string
function constructElements(root) {
  html_string += root.opening_tags;

  if (root.children.length < 0) return;

  root.children.map(child => {
    constructElements(child);
  });

  html_string += root.ending_tags;
}

async function constructHead() {
  var head_string = '<head>';
  for (var css_file_ref of css_files) {
    var css_path = `./css/${css_file_ref}`;
    head_string += `<link rel="stylesheet" href="${css_path}">`
  }

  head_string += '</head>';
  html_string += head_string;

  return head_string;
}

function parseHtmlIntoTree(html_element, depth) {
  var [head, tail] = html_element.split('<!--SPLIT-->');
  var node = new Node(Math.random() * 10, head, tail);

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
        // console.log('The script name is', script_name);
      } else {

        const tab_count = element.split(':').length - 1; // this is the depth
        const element_name = element.replaceAll(':', '').replaceAll('\n', '');

        if (map.has(element_name)) {
          var element_class = map.get(element_name);
          var element_type = element_class.getType();
          console.log("element type", element_type);


          // parse stateless entities
          if (element_type == 'stateless') {
            var html_element = await element_class.createElement();
            try {
              var css_refs = await element.getCssFiles();
              css_refs.map(css_ref => css_files.push(css_ref));
            } catch (error) {
              console.log('Style links for this element does not exist');
            }
            parseHtmlIntoTree(html_element, tab_count);
          } else if (element_type == 'stateful') {
            console.log("we are parsing a stateful component. wooohooo");
            var html_element = await element_class.createElement();
            try {
              var css_refs = await element.getCssFiles();
              css_refs.map(css_ref => css_files.push(css_ref));
            } catch (error) {
              console.log('Style links for this element does not exist');
            }
            parseHtmlIntoTree(html_element, tab_count);

          }

        } else {
          // this is where we will build the form
          var form_string = await parseFormFields(element_name, script_name);
          parseHtmlIntoTree(form_string, tab_count);
        }
      }

    }

  }

  // construct the html string; sequential execution
  constructHead();
  constructElements(last_inserted_depth[0]);

  return html_string; // return the global string variable
}


function reset() {
  html_string = '';
}


module.exports = { parseElements, reset };
