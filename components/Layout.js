const path = require('node:path')
const fs = require('node:fs/promises');
const Entity = require('./Entity');

class Layout extends Entity {

  static _className = 'Layout';

  constructor() {
    super();
  }

  async createElement(args = []) {
    return `
      <div class='layout'>
      <!--SPLIT-->
      </div> 
    `;
  }

  async getCssFiles() {
    // const file_path = path.join(__dirname, '..', 'css', Layout._className + '.css');
    // const css_file = await fs.readFile(file_path, 'utf-8');
    return [`Layout`];
  }

}

module.exports = Layout;
