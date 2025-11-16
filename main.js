const express = require('express')
const {getElements, parseElements} = require('./rblCompiler')
const fs = require('node:fs')
const path = require('node:path')
const readline = require('readline')
const map = require('./componentMap')

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  parseElements().then((elements) => {
    res.send(elements);
  })
})

app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
})