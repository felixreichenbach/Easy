const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const realmApp = require("./realm/app");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

// REST API insert endpoint
app.get('/create', (req, res) => {
  let result = realmApp.create();
  res.send(result);
})

app.listen(port, () => {
  console.log(`Digital-Twin app listening on port ${port}`);
});


