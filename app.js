const express = require('express');
const app = express();
const axios = require('axios');
const { response } = require('express');

// the json parser for calling res.json with an object in the response
app.use(express.json())

//res.json or res.send are required for all express requests
//this is just a get route to practice mapping over the request body (object) and return an array with objects
app.get('/', function(req, res, next) {
    try {
        let developers = req.body.developers
            res.json(
                developers.map(d => [{
                    name: d
                }]))
        }
    catch (err) {
        next(err);
    }
})

app.post('/', function(req, res, next) {
    try {
        // take the body of the request and find an array labeled 'developers'
        // then map the array of developers to an array of objects and store it in a variable called 'results'

        let results = req.body.developers.map(async d => await axios.get(`https://api.github.com/users/${d}`))
        // use the Promise.all function to wait for all the requests to finish and store the results in a variable called 'newPromise'
        let newPromise = Promise.all(results)
        // use the .then function to wait for the newPromise to finish and then send the results to the client
        newPromise.then(result => {
            // res.json is required for any express request 
            // then we use the map function to map the array of results to an array of objects
            // the schema must be precise in the front end -- you may need to console.log the results
            res.json(result.map(devs =>[{

                bio: devs.data.bio,
                name: devs.data.name

                }]))
    })
}
    catch (err) {
        next(err);
    }
})


app.use(function(err , req , res , next) {
    let status = err.status || 404;
    let message = err.message;
    return res.status(status).json({
      error: {message , status}
    })
  })

app.listen(3000, () => {
    console.log('running on port 3000')
});