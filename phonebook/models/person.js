const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        const arr = v.split("-");
        if (
          arr.lenght !== 2 &&
          !Number.isInteger(arr[0]) &&
          !Number.isInteger(arr[1])
        )
          return false;
        if (arr[0].length !== 3 || arr[0].length !== 2) return false;
        return true;
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Please use the format xxx-xxxxxxx`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
