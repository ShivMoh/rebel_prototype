const Box = require("./components/Box");
const Table = require("./components/Table");
const Layout = require("./components/Layout");

const map = new Map();

map.set("Box", new Box());
map.set("Table", new Table());
map.set("Layout", new Layout());

module.exports = map;