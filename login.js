const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Kết nối tới MongoDB (đảm bảo MongoDB đã được cài đặt và chạy)
mongoose.connect('mongodb://127.0.0.1:27017/user', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Sử dụng body-parser để đọc dữ liệu từ body của request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sử dụng EJS làm view engine
app.set('view engine', 'ejs');

// Tạo một mô hình đơn giản cho người dùng
const User = mongoose.model('User', {
    username: String,
    password: String,
    email: String, // Thêm trường email
  });
  
// Endpoint để render trang đăng nhập
app.get('/login', (req, res) => {
  res.render('login'); // Render trang EJS
});
app.get('/register', (req, res) => {
    res.render('register'); // Render trang EJS
  });
// Endpoint xử lý đăng nhập
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ username, password });

    if (user) {
        res.redirect('/');// Có thể chuyển hướng hoặc gửi phản hồi thành công tùy thuộc vào yêu cầu của bạn
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
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser) {
        res.status(400).send('Người dùng hoặc email đã tồn tại');
      } else {
        // Tạo người dùng mới
        const newUser = new User({ username, password, email });
        await newUser.save();
        res.render("login") // Có thể chuyển hướng hoặc gửi phản hồi thành công tùy thuộc vào yêu cầu của bạn
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error.message);
      res.status(500).send('Lỗi Server Nội Bộ');
    }
  });
  

// Lắng nghe cổng
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
