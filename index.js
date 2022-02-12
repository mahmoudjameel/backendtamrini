const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { checkToken } = require("./helpers/jwt");
const PORT = process.env.PORT || 5000;

//init
require("./db");

//Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//Api
app.use("/api", checkToken, require("./api/index"));

//Youtube Player
app.get("/play-youtube", (req, res) => {
  if (!req.query.videoId) {
    return res.send("يجب وضع رقم تعريف الفيديو علي يوتيوب");
  }
  res.sendFile(path.join(__dirname, "youtube-player.html"));
});
app.get("/app-ads.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "app-ads.txt"));
});

/******************************************************** */

//Serve images --> static
app.get("/images/:path/:image", (req, res) => {
  try {
    //Check if file exists
    if (
      fs.existsSync(
        path.join(__dirname, "images", req.params.path, req.params.image)
      )
    ) {
      return res.sendFile(
        path.join(__dirname, "images", req.params.path, req.params.image)
      );
    } else {
      return res.sendFile(path.join(__dirname, "images", "default", "404.jpg"));
    }
  } catch (e) {
    console.log(e);
  }
});

/*********************************************************/

//For the react app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
