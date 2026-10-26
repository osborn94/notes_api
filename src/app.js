const express = require('express');
const cookieParser = require('cookie-parser');
const testRouter = require('./routes/test.routes');
const userRouter = require('./routes/user.routes');

const noteRouter = require('./routes/note.routes');


const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/v1/test', testRouter);
app.use('/v1/users', userRouter);
app.use('/v1/notes', noteRouter);

module.exports = app;







