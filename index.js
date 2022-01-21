const path = require("path");
const hbs = require("hbs");
const requests = require("requests");
const express = require("express");
const app = express();

const staticPath = path.join(__dirname, "./public");
const templatePath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);

app.use(express.static(staticPath));

app.get("/", (req, res) => {
  let weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&units=metric&appid=1b98e78fee11697d45ccab952814d63b`;

  requests(weatherApi)
    .on("data", function (chunk) {
      const objData = JSON.parse(chunk);
      const arrData = [objData];
      let paramsObj = "";

      if (arrData[0].cod == 200) {
        paramsObj = {
          name: arrData[0].name,
          temp: arrData[0].main.temp,
        };
      }
      res.render("index", paramsObj);
    })
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);

      console.log("end");
    });
  // res.end();
  // res.render("index", { name: "Shubham" });
});

app.get("/about", (req, res) => {
  res.render("about", { name: "Kasera" });
});

app.get("*", (req, res) => {
  res.send("404 Not found");
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
