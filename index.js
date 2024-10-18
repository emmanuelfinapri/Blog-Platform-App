const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connnected to DB"))
  .catch(() => console.log("Error connecting to DB "));

const PORT = process.env.PORT;

//use middlewares
app.use(cookieParser());
app.use(express.json());

// use routers
app.use(authRoute);
app.use(userRoute);

app.listen(PORT, () => {
  console.log(`Blog App running on Port: ${PORT}`);
});
