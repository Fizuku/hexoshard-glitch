//Dependencies
const express = require("express");
const app = express();

const fs = require("fs");

// DO NOT EDIT THIS FILE IF YOU DON'T KNOW HOW TO.
// Unless you wanna break your database shard.

//SQLite database :D
const db = require("quick.db");

// The database starts here.
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Fetch all data as an Array.
app.get(`/fetchall`, async (req, res) => {
  let fullDB = await db.all()
  res.json(fullDB);
});

// Fetch a data.
// e.g. https://hexodb.glitch.me/fetch?money
// Fetches the "money" ID.

app.get(`/fetch`, (req, res) => {
  let url = req.originalUrl;
  let query = url.slice(7);
  let value = db.fetch(query);
  
  let fragment = {
    ID: query,
    data: value
  }
  
  res.json(fragment)
});

// Like any other database, you can also write in it!
// EDITING MANUALLY IN AN SQLITE FILE IS NOT RECOMMENDED
// You can write to your database using the hexo-db NPM package!

app.get(`/set`, (req, res) => {
  let url = req.originalUrl;
  let query = url.slice(7).split("=")[0];
  let value = url.split("=").pop();
  value = value.replace(/"/g, " ");
  db.set(query, value);
  let data = db.fetch(query)
  
  let fragment  = {
    ID: query,
    data: data,
    operation: true
  }
  
  res.json(fragment);
});

app.get(`/delete`, (req, res) => {
  let url = req.originalUrl;
  let query = url.slice(8)
  db.delete(query);
  let data = db.fetch(query)
  
  let fragment  = {
    ID: query,
    data: data,
    operation: true
  }
    
  if(data == null) res.json(fragment);
  
});

app.get(`/add`, (req, res) => {
  let url = req.originalUrl;
  let query = url.slice(5).split("=")[0];
  let value = url.split("=").pop();
  value = parseInt(value);
  
  db.add(query, value)
  let data = db.fetch(query);
  
  let fragment = {
    ID: query,
    data: value
  }
  res.json(fragment);
});

app.get(`/subtract`, (req, res) => {
  let url = req.originalUrl;
  let query = url.slice(10).split("=")[0];
  let value = url.split("=").pop();
  value = parseInt(value);
  
  db.subtract(query, value)
  let data = db.fetch(query);
  
  let fragment = {
    ID: query,
    data: value
  }
  res.json(fragment);
});



app.get("/latency", (req, res) => {

  let ltc = {
    ping: Date.now()
  }
  
  res.json(ltc);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
