const express = require("express"); 
const path = require("path");
const { PageError } = require("./controllers/error.js");
const app = express();

const {HostRouter}  = require("./routes/HostRouter.js");
const UserRouter = require("./routes/UserRouter.js");
const AppRouter = require("./routes/Approuter.js");
const  {SignUpRouter}  = require("./routes/SignUpRouter.js");
const  {LoginRouter}  = require("./routes/LoginRouter.js");

const PORT = 2300;
const mongoose = require("mongoose");
const session = require("express-session");

const MongoStore = require("connect-mongo");



const DATAPATH =
"mongodb+srv://SquadHireDatabase:SquadHire%40Pass@squadhirecluster.2bvqtjh.mongodb.net/SquadHireDB?retryWrites=true&w=majority&appName=SquadHireCluster";

app.use(session({
  secret: "Airbnb Activities beyond your imagination",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: DATAPATH,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use( '/uploads', express.static(path.join(__dirname, "uploads")));
app.use( '/uploads/reels', express.static(path.join(__dirname, "uploads/reels")));

app.use("/guest", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/signup");
  }
  next();
});

app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/signup");
  }
  next();
});

app.use("/book", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/signup");
  }
  next();
});
app.use("/reels" , AppRouter);
app.use("/guest", UserRouter);
app.use("/host", HostRouter);
app.use("/signup", SignUpRouter);
app.use(LoginRouter);

app.use(PageError);

mongoose
  .connect(DATAPATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}/guest`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed → ", err);
  });
