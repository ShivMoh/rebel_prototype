const fs = require('node:fs');
const path = require('node:path');

async function getFormFields(fields) {
  var form_string = '';
  var index = 0;

  for (var field of fields) {
    const [type, name] = field.replaceAll('    ', '').split('|')

    form_string += await constructFormField(type, name);

    if (index == fields.length - 1) {
      form_string += '<!--SPLIT-->';
    };
    index++;
  }

  return form_string;
}

async function parseFormFields(formElement, script_name) {

  // console.log(formElement);
  const [identifier, args] = formElement.replaceAll('\n', '').split('#');
  const [mode, form_name, func_name, fields] = args.split(',');
  var stripped_form_name = form_name.replaceAll('--name=', '');
  var stripped_function_name = func_name.replaceAll('--function=', '');
  var form_string = `<form id=${stripped_form_name}>`;
  var fields_arr = fields.replaceAll('--fields=', '').split('&');
  form_string += await getFormFields(fields_arr);
  var function_string = await connectFunction(script_name, func_name);

  var form_script_tag = `
    <script>
    var form = document.getElementById('${stripped_form_name}');
    
    form.addEventListener('submit', ${stripped_function_name});

    ${function_string}

    </script>
  `;

  form_string += form_script_tag;
  form_string += `<button type='submit'> submit here </button>`;
  form_string += '</form>';

  return form_string;

}

async function connectFunction(script_name, function_name) {
  var file_path = path.join('./test', script_name);
  const ssr_file = await fs.promises.readFile(file_path, { encoding: 'utf-8' });

  return ssr_file;
}

async function constructFormField(type, name) {
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
