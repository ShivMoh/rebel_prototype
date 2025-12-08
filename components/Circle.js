const path = require('node:path')
const fs = require('node:fs/promises');
const Entity = require('./Entity');

class Circle extends Entity {

  static _className = 'Circle';

  constructor() {
    super();
  }

  async createElement() {
    return `
        <div class='circle'>
        </div>
      `;
  }

  async getCssFiles() {
    // const file_path = path.join(__dirname, '..', 'css', Layout._className + '.css');
    // const css_file = await fs.readFile(file_path, 'utf-8');
    return [`Circle`];
  }
}

module.exports = Circle;
