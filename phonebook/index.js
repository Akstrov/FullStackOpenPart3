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

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.find({})
    .then((result) => {
      res.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
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

  Person.create(person)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((result) => {
      res.json(result);
      console.log(result);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
