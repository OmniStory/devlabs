// set server
const express = require("express");
const app = express();
const PORT = 3000;

// use static files
app.use(express.static(__dirname ));

// set path
app.get('/', (req, res)=>{
  res.sendFile( __dirname + "/main.html");
})
app.get("/video-conf", (req, res) => {
  res.sendFile( __dirname +"/video-conference/index.html");
});
app.get("/audio-conf", (req, res) => {
  res.sendFile( __dirname +"/audio-conference/index.html");
});
app.get("/video-call", (req, res) => {
  res.sendFile( __dirname +"/videocall/index.html");
});
app.get("/audio-call", (req, res) => {
  res.sendFile( __dirname +"/audiocall/index.html");
});


// run server
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});

