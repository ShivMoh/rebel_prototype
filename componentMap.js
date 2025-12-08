const Box = require("./components/Box");
const Table = require("./components/Table");
const Layout = require("./components/Layout");
const Circle = require("./components/Circle");

const map = new Map();

map.set("Box", new Box());
map.set("Layout", new Layout());
map.set("Circle", new Circle());

module.exports = map;
