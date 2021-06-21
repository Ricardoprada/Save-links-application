const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const { join } = require('path');

// Initialization
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.set('views'), 'layouts'),
  partialsDir: path.join(app.set('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Goblal Variables
app.use((req, res, next) => {
  next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Stating Server
app.listen(app.get('port'), () => {
  console.log("Server on pot ", app.get('port'))
});