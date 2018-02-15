 // form here
 // install sqlite3 to local machine and setting database
 const sqlite = require('sqlite3'),
       Sequelize = require('sequelize'),
       request = require('request'),
       express = require('express'),
       app = express();
 const ThirdPartyApi = 'http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1';
 const MinimumNumberOfReviews = 5;
 const MinimalRating = 4.0;

 const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// Connecting the database with SQL
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
   let filmId = req.params.id;
   let data = [];

    db.all(`SELECT films.id, films.title, films.release_date,  genres.name FROM films
             INNER JOIN genres ON films.genre_id=genres.id
             WHERE
             genre_id = (SELECT genre_id FROM films WHERE id = ${filmId})
             AND
             release_date > date((SELECT release_date FROM films WHERE id = ${filmId}), '-15 years')
             AND
             release_date < date((SELECT release_date FROM films WHERE id = ${filmId}), '+15 years')
             AND
             films.id != ${filmId}`,
              [], function(err, rows) {
    if (err) {
      throw err;
    }
    rows.forEach(function(row) {
      let film = {};
      film.id = row.id;
      film.title = row.title;
      film.releaseDate = row.release_date;
      film.genre = row.name;
      data.push(film);
      //console.log(film);
      //console.log(row.title);
      //console.log(row.id);
      //console.log(row.release_date);
      //console.log(row.name);
      //sortFilms();


    });
    //console.log(data);
    sortFilms(data);
  });


    function sortFilms(dataDb) {
      //console.log(dataDb);
      let numberThirdPartyAPIcalls = 0;


      for(let index=0; index<dataDb.length; index++){


      //console.log(dataDb[index]);
      request('http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films='+dataDb[index].id, function(error, response) {
        numberThirdPartyAPIcalls++;
        if(error){
        console.log(error); //handlin error


        //let obj = JSON.parse(response.body);
        }
        else{
          if (JSON.parse(response.body)[0].reviews.length >= MinimumNumberOfReviews){ //condition 1
          //console.log("object: ", JSON.parse(response.body)[0]); //printing response body
          //console.log(""); //making distance
          let object = JSON.parse(response.body)[0];
          //console.log(object); //printing all reviews

          //calculate average rating of film
          let averageRating;
          let reviews = object.reviews;
          let sum = 0; //sum of ratings needed for calculation
          for (let i=0; i<reviews.length; i++){
            //console.log(reviews[i]);
             sum = sum+reviews[i].rating;
          }
          averageRating=sum/reviews.length;
          if (averageRating>MinimalRating){
          console.log(averageRating);// printing only ratings that are greater than 4.0
        }
          }

        }

      });

    }
   }

 }



module.exports = app;
