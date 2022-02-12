const mongoose = require("mongoose");
const { MONGO_URI_DEVELOPMENT, MONGO_URI_PRODUCTION } = require("./config");

//Connect to mongodb
const URI =
  process.env.NODE_ENV === "development"
    ? MONGO_URI_DEVELOPMENT
    : process.env.NODE_ENV === "production" && MONGO_URI_PRODUCTION;
const mongoParams = {};
if(process.env.NODE_ENV === "production") {
  mongoParams.ssl = true;
  mongoParams.sslValidate = false;
}
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  ...mongoParams
});

//Handle connection and database errors
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(`MongoDB Error: ${err.message}`);
});

db.once("open", () => console.log("connected to DB"));
db.once("close", () => console.l("Connection to DB closed..."));
