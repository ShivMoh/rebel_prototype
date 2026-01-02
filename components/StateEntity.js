class StateEntity {
  static _className = 'StateEntity';

  constructor() { }

  createElement() {
    return "testing";
  }

  getType() {
    return "stateful";
  }
}

module.exports = StateEntity;
