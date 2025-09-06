const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())

let conn = null
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'jerseyjamtu',
    port: 3306
  })
}

// sign in
app.post('/create/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [results] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    const userData_db = results[0];
    console.log(userData_db);

    if (!userData_db) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    if (userData_db.password !== password) {
      return res.status(401).json({
        message: 'Incorrect password'
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        user_id: userData_db.user_id,
        email: userData_db.email,
        username: userData_db.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});


// sign up
app.post('/add-user/register', async (req, res) => {
  try {
    const data = req.body;
    console.log("ข้อมูลที่ผู้ลงทะเบียนกรอก" + data);

    const [results] = await conn.query('INSERT INTO users SET ?', data);

    res.json({
      message: 'Insert Success',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      message: "error something wrong",
      errorMessage: error.message
    });
  }
});



// commu post
app.post('/commu/post', async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    const results = await conn.query('INSERT INTO commupost SET ?', data);

    res.json({
      message: 'Insert Success',
      data: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while creating post",
      errorMessage: error.message
    });
  }
});


const port = 8000;
app.listen(port, async () => {
  await initMySQL()
  console.log('http server run at : ' + port)
})