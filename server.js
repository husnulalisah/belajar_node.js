const express = require('express');
const app = express();
const port = 3100;

//middleware data
app.use(express.json());

// //dummy data movies
// let movies = [
//     { id: 1, title: 'LOTR', director: 'Peter Jackson', year: 2001 },
//     { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
//     { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
// ];

// let idSeq = movies.length + 1; // Add this before your routes


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

app.get('/directors', (req, res) => {
  res.json(directors);
});


// app.get('/movies/:id', (req, res) => {
//     const movie = movies.find(m => m.id === parseInt(req.params.id));
//     if (movie) {
//         res.json(movie);
//    } else {
//         res.status(404).send('Movie not found');
//     }
// });


app.get('/directors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const director = directors.find(d => d.id === id);

  if (!director) {
    return res.status(404).json({ error: 'Director tidak ditemukan' });
  }

  res.json(director);
});




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

app.post('/directors', (req, res) => {
  const { name, birthYear } = req.body || {};

  if (!name || !birthYear) {
    return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
  }

  const newDirector = {
    id: directors.length ? directors[directors.length - 1].id + 1 : 1,
    name,
    birthYear
  };

  directors.push(newDirector);
  res.status(201).json(newDirector);
});

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


app.put('/directors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const directorIndex = directors.findIndex(d => d.id === id);

  if (directorIndex === -1) {
    return res.status(404).json({ error: 'Director tidak ditemukan' });
  }

  const { name, birthYear } = req.body || {};

  if (!name || !birthYear) {
    return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
  }

  const updatedDirector = { id, name, birthYear };
  directors[directorIndex] = updatedDirector;
  res.json(updatedDirector);
});


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


app.delete('/directors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const directorIndex = directors.findIndex(d => d.id === id);

  if (directorIndex === -1) {
    return res.status(404).json({ error: 'Director tidak ditemukan' });
  }

  directors.splice(directorIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server Running on localhost: ${port}`);
});