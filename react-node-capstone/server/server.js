const express = require("express"); //Imports express
const app = express(); //Intializes an express app
const port = process.env.PORT || 8080; //Creates a port varible to be used later in app.listen()
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const session = {
  secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  session.cookie.secure = true; // Serve secure cookies, requires HTTPS
}

app.use(cookieParser());
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(expressSession(session));

const passportHelper = require("./auth/passport");
passportHelper.initPassport(app);

//Routes
const eventRouter = require("./routes/events");
const authRouter = require("./routes/auth");
const userInfoRouter = require("./routes/user_info");
const appointmentRouter = require("./routes/appointments");
const advisingRouter = require("./routes/advising");
const groupsRouter = require("./routes/groups");
const mygroupsRouter = require("./routes/my_groups");
const classinfoRouter = require("./routes/class_info");
const classestakesRouter = require("./routes/classes_taken");
const profileRouter = require("./routes/profile");
const calRouter = require("./routes/calendar");

const swagger = require('swagger-ui-express');
const swag = require('./swagger.json');
app.use('/docs', swagger.serve, swagger.setup(swag));
//Connects Routes to there files.
app.use("/events", eventRouter);
app.use("/user_info", userInfoRouter);
app.use("/auth", authRouter);
app.use("/appointments", appointmentRouter);
app.use("/advising", advisingRouter);
app.use("/groups", groupsRouter);
app.use("/my_groups", mygroupsRouter);
app.use("/class_info", classinfoRouter);
app.use("/classes_taken", classestakesRouter);
app.use("/profile", profileRouter);
app.use("/calendar", calRouter);


//Error Handler
app.use((err, req, res, next) => {

    console.log(err);

  res.status(400)
    .json({
      success: false,
      messsage: err || err.messsage
    });
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
