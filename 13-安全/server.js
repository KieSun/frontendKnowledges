const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.get('/test', function(req, res) {
  let { query } = req.query
  res.header('Content-Type', 'text/html;charset=utf-8')
  res.send(`${query}`)
})
app.listen(3000, () => console.log('The server is starting at port 3000'))
