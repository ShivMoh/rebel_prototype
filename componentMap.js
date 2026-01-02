const Box = require("./components/Box");
const Layout = require("./components/Layout");
const Circle = require("./components/Circle");
const TestState = require("./components/TestState");

const map = new Map();

map.set("Box", new Box());
map.set("Layout", new Layout());
map.set("Circle", new Circle());
map.set("TestState", new TestState());

module.exports = map;
