function parseFormFields(formElement) {
    // console.log(formElement);
    
    const [identifier, args] = formElement.replaceAll('\n', '').split('#');
    const [mode, form_name, fields] = args.split(',');
    console.log(mode, form_name, fields); 
    var form_string = `<form id=${form_name.replaceAll('--name=', '')}>`;

    var fields_arr = fields.replaceAll('--fields=', '').split('&');

    fields_arr.map((field, index) => {
        const [type, name] = field.replaceAll('    ', '').split('|')
        form_string += constructFormField(type, name);
        
        if (index == fields_arr.length - 1) {
            form_string += '<!--SPLIT-->';
        };
    });
    
    form_string += '</form>';
    
    return form_string;

}

function constructFormField(type, name) {
    if (type != 'text-area') {
        return `<input type=${type} name=${name} />`
    }

    return `<text-area name=${name} col=20 row=10></text-area>`
}

module.exports = {parseFormFields}