const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const loginCodes = new Map(); // username -> code

app.post('/request-login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const code = uuidv4().split('-')[0];
  loginCodes.set(username, code);
  console.log(`[LOGIN] Code for ${username}: ${code}`);
  res.json({ code });
});

app.post('/verify-code', (req, res) => {
  const { username, code } = req.body;
  if (loginCodes.get(username) === code) {
    loginCodes.delete(username);
    console.log(`[VERIFY] ${username} logged in successfully`);
    res.json({ success: true });
  } else {
    console.log(`[VERIFY FAIL] ${username} provided invalid code`);
    res.status(400).json({ success: false, error: 'Invalid code' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
