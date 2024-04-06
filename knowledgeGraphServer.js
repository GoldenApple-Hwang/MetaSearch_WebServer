const express = require('express')
const app = express()
const path = require('path')

app.listen(8080, function () {
  console.log('listening on 8080')
})

app.use(express.static(path.join(__dirname, '../metasearch_knowledgegraph/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../metasearch_knowledgegraph/build/index.html'))
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../GoldenApple/metasearch_knowledgegraph/build/index.html'));
});
