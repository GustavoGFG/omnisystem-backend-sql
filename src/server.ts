import express from 'express';
import cors from 'cors';
import { requestInterceptor } from './utils/requestInterceptor';

import adminRoutes from './routes/admin';

const app = express();

// CONFIGS
app.use(cors());
app.use(express.json());

// ROUTES
app.all('*', requestInterceptor);

// app.use('/admin', adminRoutes)
app.use('/', adminRoutes);

// LISTEN TO SERVER
app.listen(process.env.PORT || 4000, (error?: Error) => {
  if (!error) {
    console.log('Server Running on Port 4000');
  } else {
    console.log('Error: ', error);
  }
});
