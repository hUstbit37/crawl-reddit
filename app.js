import express, { json } from 'express';
import redditRoutes from './src/routes/redditRoutes.js';

const app = express();

app.use(json());  // Cấu hình body-parser

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/api/reddit', redditRoutes);  // Sử dụng các route từ redditRoutes

export default app;
// const port = 8000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });