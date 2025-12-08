const path = require('node:path')
const fs = require('node:fs/promises');
const Entity = require('./Entity');

class Box extends Entity {

  static _className = 'Box';

  constructor() {
    super();
  }

  async createElement() {
    return `
        <div class='box'></div>
    `;
  }

  async getCssFiles() {
    return [`Box`];
  }

}

module.exports = Box;
