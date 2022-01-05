const express = require('express');
const cors = require('cors');
const fs = require('fs');

const { generateFile } = require('./generateFile')
const { execute } = require('./execute')

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ application: 'Replit Clone Backend' })
})

app.post("/run", async (req, res) => {
  const { language = 'javascript', code } = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" })
  }
  try {
    // generate a javascript file with content from request
    const filepath = await generateFile(language, code);
    // run the file and send response back
    const output = await execute(filepath);
    // delete code file
    fs.unlinkSync(filepath)
    return res.json({ filepath, output })
  } catch (err) {
    res.status(500).json({ err })
  }
})

app.listen(5000, () => {
  console.log("Listening on port 5000")
})