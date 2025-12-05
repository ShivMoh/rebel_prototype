const fs = require('node:fs');
const path = require('node:path');

async function parseFormFields(formElement) {

  // console.log(formElement);
  const [identifier, args] = formElement.replaceAll('\n', '').split('#');
  const [mode, form_name, func_name, fields] = args.split(',');
  var stripped_form_name = form_name.replaceAll('--name=', '');
  var stripped_function_name = func_name.replaceAll('--function=', '');
  var form_string = `<form id=${stripped_form_name}>`;
  var fields_arr = fields.replaceAll('--fields=', '').split('&');

  fields_arr.map((field, index) => {
    const [type, name] = field.replaceAll('    ', '').split('|')

    form_string += constructFormField(type, name);

    if (index == fields_arr.length - 1) {
      form_string += '<!--SPLIT-->';
    };
  });

  var form_script_tag = `
    <script>
    var form = document.getElementById('${stripped_form_name}');
    
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);

      const formObject = Object.fromEntries(formData.entries());
      console.log("form object", formObject);
    });

    </script>
  `;


  const files = await fs.promises.readdir(directory_path);
  const dir = './test';

  for (const file of files) {

    var srr_file_path = path.join(dir, file);

    console.log("file_path", srr_file_path);

    const ssr_file = await fs.promises.readFile(srr_file_path, { encoding: 'utf-8' });

    console.log("file path", ssr_file);
  }

  form_string += form_script_tag;
  form_string += `<button type='submit'> submit here </button>`;
  form_string += '</form>';

  return form_string;

}

function connectFunction(function_name) {
  console.log("function name", function_name);

  const file = 'test';

}

function constructFormField(type, name) {
  if (type != 'text-area') {
    return `<input 
              type=${type} 
              name=${name}
              id=${name}
            />`
  }
  return `<text-area name=${name} col=20 row=10></text-area>`;
}

module.exports = { parseFormFields }
