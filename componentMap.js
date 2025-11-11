const Box = require("./components/Box");
const Table = require("./components/Table");

const map = new Map();

map.set("Box", new Box());
map.set("Table", new Table());

module.exports = map;