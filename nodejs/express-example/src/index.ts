import express from "express";
const app = express();
const port = 3000;
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
