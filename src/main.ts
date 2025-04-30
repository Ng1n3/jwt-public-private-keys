import express, { Application } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

app.get('/v1/healthcheck', (req, res) => {
  try {
    res.send({ message: 'Server is up and running' });
  } catch (error: any) {
    console.error('Error checking health of the server: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});