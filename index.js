//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');
const { query } = require('express');

const app = express();

//Port environment variable already set up to run on Heroku
let port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

//Set Cors-related headers to prevent blocking of local requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//Start on rigth ID 
let nextTunesId = '4';
let nextGenresID = '2';

//The following is an example of an array of two tunes.  Compared to assignment 2, I have shortened the content to make it readable
var tunes = [
    { id: '0', name: "Für Elise", genreId: '1', content: [{note: "E5", duration: "8n", timing: 0},{ note: "D#5", duration: "8n", timing: 0.25},{ note: "E5", duration: "8n", timing: 0.5},{ note: "D#5", duration: "8n", timing: 0.75},
    { note: "E5", duration: "8n", timing: 1}, { note: "B4", duration: "8n", timing: 1.25}, { note: "D5", duration: "8n", timing: 1.5}, { note: "C5", duration: "8n", timing: 1.75},
    { note: "A4", duration: "4n", timing: 2}] },

    { id: '3', name: "Seven Nation Army", genreId: '0', 
    content: [{note: "E5", duration: "4n", timing: 0}, {note: "E5", duration: "8n", timing: 0.5}, {note: "G5", duration: "4n", timing: 0.75}, {note: "E5", duration: "8n", timing: 1.25}, {note: "E5", duration: "8n", timing: 1.75}, {note: "G5", duration: "4n", timing: 1.75}, {note: "F#5", duration: "4n", timing: 2.25}] }
];

let genres = [
    { id: '0', genreName: "Rock"},
    { id: '1', genreName: "Classic"}
];

//Your endpoints go here

// Read all tunes
app.get('/api/v1/tunes/genres/:genresId',(req, res)=>{
    let arr =[];
    /*let filterList = tunes.filter(req.params.genresId );*/
    for(let i=0; i < tunes.length; i++){
        if (tunes[i].genreId == req.params.genresId ){
            const values = Object.values(tunes[i]);
            var obj = {id:values[0], name:values[1], genreId:values[2]};
            arr.push(obj);

            }
    }
    return res.status(200).json(arr);
});

//Read an individual
app.get('/api/v1/tunes/:tunesId',(req, res)=> {
    for(let i = 0; i < tunes.length; i++){
        if (tunes[i].id == req.params.tunesId){
            res.status(200).json(tunes[i]);
            return;
        }

    }
    res.status(404).json({'message': "Tune with id " + req.params.tunesId + "dose not exist."});
    
});

//Creat a new tune
app.post('/api/v1/tunes/genres/:genresId',(req, res)=> {
    if(req.body === undefined || req.body.name === undefined || req.body.content === undefined){
        return res.status(400).json({'message': "Name and content are requires"});
    }else{
        for(let i=0; i<tunes.length; i++){
            let newTune = {id:nextTunesId, name:req.body.name, genreId:req.params.genresId , content:[{note:req.body.note, duration:req.body.duration, timing:req.body.timing}]};
            nextTunesId++;
            tunes.push(newTune);
            res.status(201).json(newTune);
            return;

        }

    }

});

//Partially update a tune 
app.patch('/api/v1/tunes/:tunesId/genres/:genresId',(req, res)=> {
    if (req.body === undefined){
        res.status(400).json({'message': "Body is requred in the request body"});
    }else{
        for(let i=0; i< tunes.length; i++){
            if(tunes[i].id == req.params.tunesId){
                if(req.body.name !== undefined){
                    tunes[i].name = req.body.name;
                }
                if(req.params.genresId !== undefined){
                    tunes[i].genreId == req.body.genreId;
                }
                if(req.body.content !== undefined){
                    tunes[i].content = [{note:req.body.note, duration:req.body.duration, timing:req.body.timing}];
                }

                res.status(200).json(tunes[i]);
                return;

            }
        
        }
        res.status(404).json({'message': "Tune with the id " + req.params.tunesId + " does not exist"});
    }

});

// Read all genres
app.get('/api/v1/genres',(req, res)=> {
    let allGenres =[];
        for(let i=0; i < genres.length; i++){
            const values = Object.values(genres[i]);
            var obj = {id:values[0], genreName:values[1]};
            allGenres.push(obj);
    }
    return res.status(200).json(allGenres);

});

// Creat an New genre
app.post('/api/v1/genres',(req, res)=> {
    if(req.body === undefined || req.body.genreName === undefined){
        return res.status(400).json({'message': "Name are requires"});
    }else{
        for(let i=0; i < genres.length; i++){
            console.log(genres[i].genreName)
            console.log(req.body.genreName)
            if(genres[i].genreName.toLowerCase() == req.body.genreName.toLowerCase()){
                return res.status(400).json({'message': "This name have been used"});}

    }
    let newGenre = {id:nextGenresID, genreName:req.body.genreName};
    nextGenresID ++;
    genres.push(newGenre);
    res.status(201).json(newGenre);
    return;   
}

});

// Delete a genre
app.delete('/api/v1/tunes/:tunesId/genres/:genresId',(req, res)=> {
    for(let i=0; i< genres.length; i++){
        if(genres[i].id == req.params.genresId){
            for(let j=0; j< tunes.length; j++){
                if(tunes[j].genreId == req.params.genresId){
                    res.status(404).json({'message': "Can not delete Gennre with the id " + req.params.genresId + " it have tune"});
                }else{
                    res.status(200).json(genres.splice(j,1));
                }
            }
            
        }else{
            res.status(404).json({'message': "Genre with the id " + req.params.genresId + " does not exist"});
        }
    }

});

//Start the server
app.listen(port, () => {
    console.log('Tune app listening on port + ' + port);
});