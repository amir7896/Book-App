const express = require("express");
const dbconnection = require("./config/db");
const userRoute = require("./routes/auth");
const bookRoute = require("./routes/book");
const googleRoute = require("./routes/google_login");
const cors = require("cors");

// app.use(cors({ origin: "*" }));

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("E-Commerce Application");
});

app.use(express.json());
// Different Routes ..
app.use("/", userRoute);
app.use("/book", bookRoute);
app.use("/google", googleRoute);
// App For Allow Headers ...
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
// Database Connection
dbconnection();

app.listen(4000, () => {
  console.log("Server is Listening on Port 4000");
});
