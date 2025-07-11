const mongoose = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const aboutRouter = require('./backend/routes/about_route');
const costRouter = require('./backend/routes/cost_route');
const userRouter = require('./backend/routes/user_route');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', aboutRouter);
app.use('/api', costRouter);
app.use('/api', userRouter);

const uri = 'mongodb+srv://orelfl770:Orel123456Nimrod@clustercostmanager.43ewl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCostManager';
// Connect to MongoDB
mongoose.connect(uri,    {
      useNewUrlParser: true,
      useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected successfully.'))
    .catch((err) => console.error('MongoDB connection error:',err));

app.get('/', (req, res) => {
    res.status(200).send('Cost Manager API is live!');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
