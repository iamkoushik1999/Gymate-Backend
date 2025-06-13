import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const { PORT } = process.env;

app.get('/', (req, res) => {
  res.send('Gymate server is running!!!');
});

app.listen(PORT, () => {
  console.log(`Server is running on :-> ${PORT}`);
});
