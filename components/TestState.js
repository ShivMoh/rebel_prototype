const StateEntity = require('./StateEntity');

class TestState extends StateEntity {
  static _className = 'TestState';

  constructor() { super() }

  createElement() {
    return "<h1>This is a stateful component</h1>";
  }


}

module.exports = TestState;
