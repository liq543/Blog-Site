const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes = require('./routes');  // Ensure you set up an index.js in the routes folder that exports all routes
const sequelize = require('./config/connection'); // This will be your Sequelize configuration

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // To serve static files

// Setup handlebars as the view engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Session middleware
const sess = {
    secret: 'SuperSecretCode',  // Change this to a secure, random string
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

// Routes
app.use(routes);

// Start server
sequelize.sync({ force: false }) // force: true will reset database on every start
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    });
