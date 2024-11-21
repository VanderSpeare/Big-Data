

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Chart = require('chart.js');
const app = express();
const _ = require('underscore');
const bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/webMovies', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const movieSchema = new mongoose.Schema({
  adult: Boolean,
  backdrop_path: String,
  genre_ids: [Number],
  id: Number,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: String,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const userModel = mongoose.model('User', userSchema);

const checkAdminAuthentication = (req, res, next) => {
  const isAdmin = nameAc==="admin" && temp.password==="a"
  if (isAdmin) {

    next();
  } else {
    res.send("Không phải admin")
  }
};

app.get('/login', (req, res) => {
  res.render('login'); // Render trang EJS
});
app.get('/register', (req, res) => {
    res.render('register'); // Render trang EJS
  });
let nameAc
let temp
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  nameAc=username
  temp={ username, password };
  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await userModel.findOne({ username, password });

    if (user) {
      res.redirect('/');
    } else {
      res.status(401).send('Tên người dùng hoặc mật khẩu không đúng');
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Kiểm tra xem người dùng hoặc email đã tồn tại chưa
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      res.status(400).send('Người dùng hoặc email đã tồn tại');
    } else {
      // Tạo người dùng mới
      const newUser = new userModel({ username, password, email });
      await newUser.save();
      res.render("login");
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});
app.get('/logout', (req, res) => {
  nameAc=null
  res.redirect('/login');
});
app.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      // Nếu có truy vấn tìm kiếm, lọc phim dựa trên tiêu đề hoặc các trường liên quan khác
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } }, // Tìm kiếm không phân biệt chữ hoa/thường theo tiêu đề
          { original_title: { $regex: search, $options: 'i' } }, // Tìm kiếm không phân biệt chữ hoa/thường theo tiêu đề gốc
          // Thêm các trường khác nếu cần
        ],
      };
    }

    const movies = await Movie.find(query);
    
    res.render('index', { movies, search,nameAc });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});

// https://image.tmdb.org/t/p/w500/9PqD3wSIjntyJDBzMNuxuKHwpUD.jpg
app.get('/statistics/genre', async (req, res) => {
  try {
    const movies = await Movie.find({}, { _id: 0 });

    // Tính toán thống kê theo thể loại
    const genreStatistics = calculateGenreStatistics(movies);

    // Render trang thống kê theo thể loại bằng EJS
    res.render('genreStatistics', { genreStatistics });
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
// Hàm tính toán thông số tổng quan
const calculateOverviewStatistics = (movies) => {
  const totalMovies = movies.length;
  const totalStats = calculateTotalStats(movies);
  const totalPopularity = movies.reduce((acc, movie) => acc + movie.popularity, 0);
  const averagePopularity = totalMovies > 0 ? totalPopularity / totalMovies : 0;

  return { totalMovies, totalPopularity, averagePopularity, totalStats };
};

app.get('/statistics/overview',checkAdminAuthentication, async (req, res) => {
  try {
    const movies = await Movie.find({}, { _id: 0 });

    // Tính toán các thông số tổng quan
    const overviewStatistics = calculateOverviewStatistics(movies);

    // Render trang thống kê tổng quan bằng EJS
    res.render('overviewStatistics', overviewStatistics);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/statistics/language', async (req, res) => {
  try {
    const movies = await Movie.find({}, { _id: 0 });

    // Tính toán thống kê theo ngôn ngữ
    const languageStatistics = calculateLanguageStatistics(movies);

    // Render trang thống kê theo ngôn ngữ bằng EJS
    res.render('languageStatistics', { languageStatistics });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});
app.get('/statistics/release-date', async (req, res) => {
  try {
    const movies = await Movie.find({}, { _id: 0 });

    const releaseDateStatistics = calculateReleaseDateStatistics(movies);

    res.render('releaseDateStatistics', { releaseDateStatistics });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});
app.get('/statistics/adult', async (req, res) => {
  try {
    const movies = await Movie.find({}, { _id: 0 });

    // Tính toán thống kê theo tuổi
    const adultStatistics = calculateAdultStatistics(movies);

    // Render trang thống kê theo tuổi bằng EJS
    res.render('adultStatistics', { adultStatistics });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});
const calculateTotalStats = (movies) => {
  const totalStats = {
    totalVotes: 0,
    totalPopularity: 0,
  };

  movies.forEach((movie) => {
    totalStats.totalVotes += movie.vote_count || 0;
    totalStats.totalPopularity += movie.popularity || 0;
  });

  return totalStats;
};
app.get('/add-movie',checkAdminAuthentication, (req, res) => {
  res.render('addMovie'); // Tạo một trang web form để nhập thông tin phim mới
});


app.post('/add-movie', async (req, res) => {
  try {
    const {
      title,
      adult,
      backdrop_path,
      genre_ids,
      id,
      original_language,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      video,
      vote_average,
      vote_count,
    } = req.body;

    // Chuyển đổi chuỗi genre_ids thành mảng số
    const genreIdsArray = genre_ids.split(',').map(Number);

    
    const parsedId = !isNaN(Number(id)) ? Number(id) : generateRandomNumber();
    const parsedGenreIds = genreIdsArray.every(g => !isNaN(g)) ? genreIdsArray : [generateRandomNumber()];

    const newMovie = new Movie({
      title,
      adult: !!adult, 
      backdrop_path,
      genre_ids: parsedGenreIds,
      id: parsedId,
      original_language,
      original_title,
      overview,
      popularity: !isNaN(Number(popularity)) ? Number(popularity) : 0,
      poster_path,
      release_date,
      video: !!video, 
      vote_average: !isNaN(Number(vote_average)) ? Number(vote_average) : 0,
      vote_count: !isNaN(Number(vote_count)) ? Number(vote_count) : 0,
    });

    await newMovie.save();

    res.redirect('/');
  } catch (error) {
    console.error('Lỗi khi thêm phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});
// Xóa một bộ phim dựa trên tiêu đề
app.post('/delete-movie/:title', checkAdminAuthentication,async (req, res) => {
  try {
    const movieTitle = req.params.title;

    // Kiểm tra xem tiêu đề có hợp lệ không
    if (!movieTitle) {
      return res.status(400).send('Invalid movie title');
    }

    // Thực hiện xóa phim từ CSDL
    const deletedMovie = await Movie.findOneAndDelete({ title: movieTitle });

    if (!deletedMovie) {
      return res.status(404).send('Movie not found');
    }

    // Chuyển hướng hoặc trả về phản hồi thành công tùy thuộc vào yêu cầu của bạn
    res.redirect('/');
  } catch (error) {
    console.error('Lỗi khi xóa phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});
app.get('/edit-movie/:title',checkAdminAuthentication, async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    res.render('editMovie', { movie });
  } catch (error) {
    console.error('Error fetching movie:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/update-movie/:title',checkAdminAuthentication, async (req, res) => {
  try {
    const movieTitle = req.params.title;

    // Kiểm tra xem tiêu đề có hợp lệ không
    if (!movieTitle) {
      return res.status(400).send('Invalid movie title');
    }

    // Lấy dữ liệu mới từ body của request
    const {
      title,
      adult,
      backdrop_path,
      genre_ids,
      id,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      video,
      // Thêm các thuộc tính khác tương ứng
    } = req.body;

    // Tìm và cập nhật phim trong CSDL
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: movieTitle },
      {
        title,
        adult: !!adult,
        backdrop_path,
        genre_ids: genre_ids.split(',').map(Number),
        id: !isNaN(Number(id)) ? Number(id) : generateRandomNumber(),
        original_language,
        original_title,
        overview,
        poster_path,
        release_date,
        video: !!video,
        // Cập nhật các thuộc tính khác tương ứng
      },
      { new: true } // Trả về bản ghi sau khi cập nhật
    );

    if (!updatedMovie) {
      return res.status(404).send('Movie not found');
    }

    // Chuyển hướng hoặc trả về phản hồi thành công tùy thuộc vào yêu cầu của bạn
    res.redirect('/');
  } catch (error) {
    console.error('Lỗi khi cập nhật phim:', error.message);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
});

// Hàm sinh ngẫu nhiên một số nguyên từ 1 đến 1000
function generateRandomNumber() {
  return Math.floor(Math.random() * 1000) + 1;
}




const calculateAdultStatistics = (movies) => {
  // Khai báo biến để lưu trữ thống kê
  let adultCount = 0;
  let nonAdultCount = 0;
  let adultPopularity = 0;
  let nonAdultPopularity = 0;

  // Lặp qua danh sách phim để tính toán thống kê
  movies.forEach((movie) => {
    if (movie.adult) {
      adultCount++;
      adultPopularity += movie.popularity;
    } else {
      nonAdultCount++;
      nonAdultPopularity += movie.popularity;
    }
  });

  // Chuyển đổi dữ liệu thành mảng để render trong EJS
  const adultStatistics = [
    { category: 'Adult', movieCount: adultCount, totalPopularity: adultPopularity },
    { category: 'Non-Adult', movieCount: nonAdultCount, totalPopularity: nonAdultPopularity },
  ];

  return adultStatistics;
};


const calculateReleaseDateStatistics = (movies) => {
  const releaseDateMap = {};

  movies.forEach((movie) => {
    const releaseDate = movie.release_date;

    if (releaseDate) {
      if (releaseDateMap[releaseDate]) {
        releaseDateMap[releaseDate].movieCount += 1;
        releaseDateMap[releaseDate].totalPopularity += movie.popularity;
      } else {
        releaseDateMap[releaseDate] = {
          movieCount: 1,
          totalPopularity: movie.popularity,
        };
      }
    }
  });

  const releaseDateStatistics = Object.keys(releaseDateMap).map((date) => ({
    date,
    movieCount: releaseDateMap[date].movieCount,
    totalPopularity: releaseDateMap[date].totalPopularity,
  }));

  return releaseDateStatistics;
};

const calculateLanguageStatistics = (movies) => {
  const languageCountMap = {};
  const languagePopularityMap = {};

  // Đếm số lượng phim và tính tổng lượt xem cho từng ngôn ngữ
  movies.forEach((movie) => {
    const language = movie.original_language;
    if (languageCountMap[language]) {
      languageCountMap[language]++;
      languagePopularityMap[language] += movie.popularity;
    } else {
      languageCountMap[language] = 1;
      languagePopularityMap[language] = movie.popularity;
    }
  });

  // Chuyển đổi dữ liệu thành mảng để render trong EJS
  const languageStatistics = Object.keys(languageCountMap).map((language) => ({
    language,
    movieCount: languageCountMap[language],
    totalPopularity: languagePopularityMap[language],
  }));

  return languageStatistics;
};


// Hàm tính toán thống kê theo thể loại
const calculateGenreStatistics = (movies) => {
  const genreCountMap = {};
  const genrePopularityMap = {};

  // Đếm số lượng phim và tính tổng lượt xem theo từng thể loại
  movies.forEach(movie => {
      movie.genre_ids.forEach(genreId => {
          const genreName = getGenreNameById(genreId);
          if (genreCountMap[genreName]) {
              genreCountMap[genreName]++;
              genrePopularityMap[genreName] += movie.popularity;
          } else {
              genreCountMap[genreName] = 1;
              genrePopularityMap[genreName] = movie.popularity;
          }
      });
  });

  // Chuyển đổi dữ liệu thành mảng để render trong EJS
  const genreStatistics = Object.keys(genreCountMap).map(genre => ({
      genre,
      movieCount: genreCountMap[genre],
      totalPopularity: genrePopularityMap[genre],
  }));

  return genreStatistics;
};

// Hàm lấy tên thể loại dựa vào ID
// Hàm lấy tên thể loại dựa vào ID
const getGenreNameById = (genreId) => {
  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    // Thêm các cặp khác tùy thuộc vào dữ liệu thực của bạn
  };

  return genreMap[genreId] || 'Unknown';
};


const insertMoviesIntoHtml = (html, movies) => {
  const movieItems = movies.map(movie => `
    <li>
      <h2>${movie.title}</h2>
      <p><strong>Original Title:</strong> ${movie.original_title}</p>
      <p><strong>Overview:</strong> ${movie.overview}</p>
      <p><strong>Release Date:</strong> ${movie.release_date}</p>
      <p><strong>Popularity:</strong> ${movie.popularity}</p>
      <p><strong>Vote Average:</strong> ${movie.vote_average}</p>
      <p><strong>Vote Count:</strong> ${movie.vote_count}</p>
      <p><strong>Adult:</strong> ${movie.adult ? 'Yes' : 'No'}</p>
      <p><strong>Video:</strong> ${movie.video ? 'Yes' : 'No'}</p>
      <p><strong>Original Language:</strong> ${movie.original_language}</p>
      <p><strong>Genres:</strong> ${movie.genre_ids.join(', ')}</p>
      <p><strong>Backdrop Path:</strong> ${movie.backdrop_path}</p>
      <p><strong>Poster Path:</strong> ${movie.poster_path}</p>
      <img src="${movie.poster_path}" alt="${movie.title} Poster" width="200">
    </li>
  `).join('');

  return html.replace('<!-- Placeholder for movies -->', movieItems);
};


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
