 // form here
 // install sqlite3 to local machine and setting database
 const sqlite = require('sqlite3').verbose(),
       Sequelize = require('sequelize'),
       request = require('request'),
       express = require('express'),
       app = express();
 const ThirdPartyApi = 'http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1';
 const MinimumNumberOfReviews = 5;
 const MinimumNumberOfRatings = 4.0;

 const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// Connecting to the database SQL
let db = new sqlite.Database(DB_PATH, sqlite.OPEN_READONLY, error => {
  if (error) {
    console.error(error.message);
  }
  console.log('You are now connected with SQL database.');
});


// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res) {
  res.status(500).send('Not Implemented');
}

module.exports = app;
