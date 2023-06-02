require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes');
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use('/', router);

(async () => {
  try {
    await app.listen(PORT, () => {
      console.log(`Server is listening to port ${PORT}`);
    });
  } catch (err) {
    console.log('error');
  }
})();
