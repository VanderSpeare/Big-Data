const axios = require('axios');
const { MongoClient } = require('mongodb');

async function fetchMovies(page = 1) {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: 'e9e9d8da18ae29fc430845952232787c',
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        page: page,
      },
    });

    const movies = response.data.results;
    console.log(`Fetched ${movies.length} movies from page ${page}`);
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    throw error;
  }
}

async function fetchAllMovies(numPages = 5) {
  const allMovies = [];

  for (let page = 1; page <= numPages; page++) {
    const movies = await fetchMovies(page);
    allMovies.push(...movies);
  }

  console.log(`Total movies fetched: ${allMovies.length}`);
  return allMovies;
}

async function saveDataToMongoDB() {
  const url = 'mongodb://127.0.0.1:27017/webMovies'; 
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('webMovies'); 
    const collection = db.collection('movies'); 

    const allMovies = await fetchAllMovies();
    const result = await collection.insertMany(allMovies);

    console.log(`Inserted ${result.insertedCount} documents into MongoDB`);
  } catch (error) {
    console.error('Error saving data to MongoDB:', error.message);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}


saveDataToMongoDB();

