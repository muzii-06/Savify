const express = require('express');
const { PythonShell } = require('python-shell');
const router = express.Router();

// API route to interact with the chatbot
router.post('/chatbot', (req, res) => {
  const userMessage = req.body.message;

  // Explicitly specify the path to Python executable (Update this with your correct Python path)
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: 'C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python310\\python.exe', // Updated with correct path
    args: [userMessage],
    scriptPath: './ai-faq', // Folder containing the query.py file
  };

  // Running Python script to process the message
  PythonShell.run('query.py', options, function (err, results) {
    if (err) return res.status(500).send("Error processing");
    return res.json({ reply: results[0] });
  });
});

module.exports = router;
