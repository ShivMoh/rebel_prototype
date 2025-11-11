const path = require('node:path')
const fs = require('node:fs/promises');
const Entity = require('./Entity');

class Table extends Entity {

    static _className = 'Table';
    constructor() {
        super();
    }

    async createElement() {
        try {
            const file_path = path.join(__dirname, '..', 'html', Table._className + '.html');
            const element = await fs.readFile(file_path, 'utf-8');
            return element;
        } catch (err) {
            console.error('Error reading file:', err);
            throw err; // rethrow so you know what failed
        }
    }


    
}

module.exports = Table;