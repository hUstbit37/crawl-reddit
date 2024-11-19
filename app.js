import express, { json } from 'express';
import redditRoutes from './src/routes/redditRoutes.js';

const app = express();

app.use(json());  // Cấu hình body-parser

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Lấy đường dẫn tuyệt đối đến thư mục chứa file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
//app.set('views', './views');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });

app.use('/api/reddit', redditRoutes);  // Sử dụng các route từ redditRoutes

export default app;
// const port = 8000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });