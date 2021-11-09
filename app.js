const express = require("express");
const app = express(); // استدعاء
const fs = require("fs");
const PORT = 5000;
app.use(express.json());

//ممكن تكون كذا او تكون جوا كل راوت
//let movies = [];
//fs.readFile('./movies.json', (err, data) => {
//const movies = JSON.parse(data.toString());
//});

function addFile(movies) {
fs.writeFile("./movies.json", JSON.stringify(movies),() => {
console.log("added!");
});
}

// 2- GET movie by id
app.get("/movies/:id", (req, res) => {
    fs.readFile('./movies.json', (err, data) => {
    let id = req.params.id;
    const movies = JSON.parse(data.toString());

    let read = movies.filter((movie) => movie.id === Number(id));
    res.json(read);
    })
});

///////////////////////////////////////////////////////////


// 3 - Create new movie
app.post("/create", (req, res) => {
const {name} = req.body;
  fs.readFile('./movies.json', (err, data) => {
    let movies = JSON.parse(data.toString());

  movies.push ({ 
      id: movies.length +1 , 
      name: name, 
      isFav: false, 
      isDeleted: false 
    });
  
      addFile(movies)
      res.status(201).json(movies);
});
})
///////////////////////////////////////////////////////////

// 4 - update all by id
app.put('/update/:id',(req,res)=> {
    fs.readFile("./movies.json", (err,data) => {
        let movies = JSON.parse(data.toString());

        const { name, isDeleted, isFav } = req.body // all togther
        movies.forEach((elem) => {
        if(elem.id == req.params.id)  {
        if(name != undefined) elem.name = name;
        if(isDeleted != undefined) elem.isDeleted = isDeleted;
        if(isFav != undefined) elem.isFav = isFav;

        }
    })
    addFile(movies);
    res.status(200).json(movies);
});
});
///////////////////////////////////////////////////////////

// 5 -  GET favourite movies
app.get('/favMovies', (req,res) => {
    fs.readFile("./movies.json", (err,data) => {
        let movies = JSON.parse(data.toString());
        
        let fav = movies.filter((movie) => movie.isFav == true && movie.isDeleted != true);
        res.status(200).json(fav);
        })
    })

///////////////////////////////////////////////////////////

// 6 - soft delete for movies

app.delete("/delete/:id", (req, res) => {
    fs.readFile("./movies.json", (err, data) => {
      let movies = JSON.parse(data.toString());
  
      movies.map((ele) => {
        if (ele.id == req.params.id) {
            ele.isDeleted = true;
          }
        });
        addFile(movies);

        const delet = movies.filter((movie) => movie.isDeleted != true);
        res.status(200).json(delet);
    });
});

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})