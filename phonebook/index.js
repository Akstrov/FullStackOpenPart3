require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("data", function (req, res) {
  return JSON.stringify(res.body);
});

app.use(morgan("tiny"));
app.use(morgan("data"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((result) => {
    res.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>`);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((result) => {
    res.json(result);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.create(person).then((result) => {
    res.json(result);
    console.log(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
