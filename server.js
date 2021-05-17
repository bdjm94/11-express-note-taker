const express = require("express");
const path = require("path");
const chalk = require('chalk');
const fs = require("fs")

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });
  
  app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  
  });

  app.post("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
      if (error) {
        return console.log(chalk.red)(error)
      }
      notes = JSON.parse(notes)

      var id = notes[notes.length - 1].id + 1
      var createNote = { title: req.body.title, text: req.body.text, id: id }
      var currentNote = notes.concat(createNote)

      fs.writeFile(__dirname + "/db/db.json", JSON.stringify(currentNote), function(error, data) {
        if (error) {
          return error
        }
        console.log(chalk.magenta)(currentNote)
        res.json(currentNote);
      })
    })
  })

  app.get("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
      if (error) {
        return console.log(chalk.red)(error)
      }
      console.log(chalk.green)("Notes", data)
      res.json(JSON.parse(data))
    })
  });

  app.delete("/api/notes/:id", function (req, res) {
    const noteId = JSON.parse(req.params.id)
    console.log(chalk.magenta)(noteId)
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
      if (error) {
        return console.log(chalk.red)(error)
      }
      notes = JSON.parse(notes)