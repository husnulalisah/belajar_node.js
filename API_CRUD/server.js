require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbMovies, dbDirectors } = require('./database.js');
const app = express();
const port = process.env.PORT || 3100;
app.use(cors());

//const port = 3100;

//middleware data
app.use(express.json());

//dummy data movies
let movies = [
    { id: 1, title: 'LOTR', director: 'Peter Jackson', year: 2001 },
    { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
    { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
];

let idSeq = movies.length + 1; // Add this before your routes


let directors = [
  { id: 1, name: 'Husnul Alisah', birthYear: 2000 },
  { id: 2, name: 'Alex Garland', birthYear: 1989 },
  { id: 3, name: 'Dian Restu', birthYear: 1983 },
  { id: 4, name: 'Natalie Portman', birthYear: 1970 },
  { id: 5, name: 'Leni pratiwi', birthYear: 1990 }
];


// app.get('/', (req, res) => {
//     res.send('Selamat datang di server Node.js!');
// });


// app.get('/movies', (req, res) => {
//     res.json(movies);
// });
// GET semua director
app.get("/directors", (req, res) => {
  dbDirectors.all("SELECT * FROM directors", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// GET director by id
app.get("/directors/:id", (req, res) => {
  dbDirectors.get("SELECT * FROM directors WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Director not found" });
    res.json(row);
  });
});

// CREATE sutradara
app.post("/directors", (req, res) => {
  const { name, birthYear } = req.body;
  dbDirectors.run(
    "INSERT INTO directors (name, birthYear) VALUES (?, ?)",
    [name, birthYear],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, birthYear });
    }
  );
});

// UPDATE sutradara
app.put("/directors/:id", (req, res) => {
  const { name, birthYear } = req.body;
  dbDirectors.run(
    "UPDATE directors SET name = ?, birthYear = ? WHERE id = ?",
    [name, birthYear, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE sutradara
app.delete("/directors/:id", (req, res) => {
  dbDirectors.run("DELETE FROM directors WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});






app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date()
  });
});





app.get('/movies', (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id ASC";

  dbMovies.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });

    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.get('/movies/:id', (req, res) => {
  const sql = "SELECT * FROM movies WHERE id = ?";
  const params = [req.params.id];
  dbMovies.get(sql, params, (err, row) => {
    if (err) {
      return res.status(400).json({"error": err.message });
    }
    res.json(row);
  });
});


//post movies
app.post('/movies', (req, res) => {
  const { title, director, year } = req.body || {};
  if (!title || !director || !year) {
    return res.status(400).json({ error: 'title, director, year is required' });
  }
  const sql = 'INSERT INTO movies (title, director, year) VALUES (?, ?, ?)';
  dbMovies.run(sql, [title, director, year], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });

    }
    res.status(201).json({id: this.lastID, title, director, year});
  });
});





// PUT movies - Memperbarui data film
app.put("/movies/:id", (req, res) => {
  const { title, director, year } = req.body;
  dbMovies.run(
    "UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?",
    [title, director, year, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE movies
app.delete("/movies/:id", (req, res) => {
  dbMovies.run("DELETE FROM movies WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Handle eror 404
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// information server listening
app.listen(port, () => {
    console.log(`Server Running on localhost: ${port}`);
});




// app.get('/movies/:id', (req, res) => {
//     const movie = movies.find(m => m.id === parseInt(req.params.id));
//     if (movie) {
//         res.json(movie);
//    } else {
//         res.status(404).send('Movie not found');
//     }
// });


// app.get('/directors/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const director = directors.find(d => d.id === id);

//   if (!director) {
//     return res.status(404).json({ error: 'Director tidak ditemukan' });
//   }

//   res.json(director);
// });




// //post movies- Membuat film baru
// app.post('/movies', (req, res) => {
//     const { title, director, year } = req.body || {};
//     if (!title || !director || !year) {
//         return res.status(400).json({ error: 'title, director, year wajib diisi' });
//     }
//     const newMovie = { id: movies.length + 1, title, director, year };
//     movies.push(newMovie);
//     res.status(201).json(newMovie);
// });

// app.post('/directors', (req, res) => {
//   const { name, birthYear } = req.body || {};

//   if (!name || !birthYear) {
//     return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
//   }

//   const newDirector = {
//     id: directors.length ? directors[directors.length - 1].id + 1 : 1,
//     name,
//     birthYear
//   };

//   directors.push(newDirector);
//   res.status(201).json(newDirector);
// });

// // put movies - Memperbarui data film 
// app.put('/movies/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const movieIndex = movies.findIndex(m => m.id === id);
//     if (movieIndex === -1) {
//         return res.status(404).json({ error: 'Movie tidak ditemukan' });
//     }
//     const { title, director, year } = req.body || {};
//     const updatedMovie = { id, title, director, year };
//     movies[movieIndex] = updatedMovie;
//     res.json(updatedMovie);
// });


// app.put('/directors/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const directorIndex = directors.findIndex(d => d.id === id);

//   if (directorIndex === -1) {
//     return res.status(404).json({ error: 'Director tidak ditemukan' });
//   }

//   const { name, birthYear } = req.body || {};

//   if (!name || !birthYear) {
//     return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
//   }

//   const updatedDirector = { id, name, birthYear };
//   directors[directorIndex] = updatedDirector;
//   res.json(updatedDirector);
// });


// //delete movies - Menghapus data film
// app.delete('/movies/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const movieIndex = movies.findIndex(m => m.id === id);
//     if (movieIndex === -1) {
//         return res.status(404).json({ error: 'Movie tidak ditemukan' });
//     }
//     movies.splice(movieIndex, 1);
//     res.status(204).send();
// });


// app.delete('/directors/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const directorIndex = directors.findIndex(d => d.id === id);

//   if (directorIndex === -1) {
//     return res.status(404).json({ error: 'Director tidak ditemukan' });
//   }

//   directors.splice(directorIndex, 1);
//   res.status(204).send();
// });

// app.listen(port, () => {
//     console.log(`Server Running on localhost: ${port}`);
// });