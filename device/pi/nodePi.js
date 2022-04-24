const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const realmApp = require("./realm/app");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

// REST API create a device endpoint
app.get('/create_device', (req, res) => {
  let result = realmApp.createDevice();
  res.send(result);
})

// REST API add a component endpoint
app.get('/add_component', (req, res) => {
  let result = realmApp.addComponent();
  res.send(result);
})

app.listen(port, () => {
  console.log(`Digital-Twin app listening on port ${port}`);
});


