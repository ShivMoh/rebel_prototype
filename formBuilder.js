function parseFormFields(formElement) {
  // console.log(formElement);
  const [identifier, args] = formElement.replaceAll('\n', '').split('#');
  const [mode, form_name, fields] = args.split(',');
  var form_string = `<form id=${form_name.replaceAll('--name=', '')}>`;
  var fields_arr = fields.replaceAll('--fields=', '').split('&');
  var script_tag = `<script>`;


  fields_arr.map((field, index) => {
    const [type, name] = field.replaceAll('    ', '').split('|')

    form_string += constructFormField(type, name);

    script_tag += `
      var element = document.getElementById(${name});
      document.addEventListener('change', function(${name}) {console.log('The name is ${name}')})
    `

    if (index == fields_arr.length - 1) {
      form_string += '<!--SPLIT-->';
    };
  });

  script_tag += `</script>`;

  form_string += '</form>';
  form_string += script_tag

  return form_string;

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
