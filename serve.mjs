import lockfile from "@yarnpkg/lockfile";
import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/yarn.json", (req, res) => {
  res.send(lockfile.parse(fs.readFileSync('./yarn.lock', 'UTF8')));
});

app.use(express.static("."));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
