const express = require('express');
const app = express();
const axios = require('axios');
const { response } = require('express');

// the json parser for calling res.json with an object in the response
app.use(express.json())

//res.json or res.send are required for all express requests
// app.post('/', function(req, res, next) {
//     try {
//         let results = req.body
//         let developers = results.developers
//             res.json(
//                 developers.map(d => [{
//                     name: d
//                 }]))
//         }
//     catch (err) {
//         next(err);
//     }
// })

app.post('/', function(req, res, next) {
    try {
        let results = req.body.developers.map(async d => await axios.get(`https://api.github.com/users/${d}`))
        let newPromise = Promise.all(results)
        newPromise.then(result => {
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