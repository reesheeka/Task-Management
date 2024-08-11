const express = require('express');
const routes = require('./routes/taskRoute.js');
const cors = require('cors')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://rishika9306781119:h8wQLB4CzfNmNxdX@cluster0.znpkfb4.mongodb.net/task-database')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err)); 

const app = express();


const PORT = 3000;

app.use(cors())
app.use(express.json());
app.use(upload.single('file'));

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
