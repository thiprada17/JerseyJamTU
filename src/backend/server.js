require('dotenv').config()

// const mysql = require('mysql2/promise')

const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json());

let mockShirts = [];



// let conn = null
// const initMySQL = async () => {
//   conn = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'jerseyjamtu',
//     port: 3306
//   })
// }

const supabaseUrl = 'https://zdhjexmsbgozpxroeaud.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaGpleG1zYmdvenB4cm9lYXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxODU3NTUsImV4cCI6MjA3Mzc2MTc1NX0.E_NmaPHl2jK_h8CTHqzfF5K8cTUMehs7Bf9nHdjLizM"
const supabase = createClient(supabaseUrl, supabaseKey)


app.post('/test', async (req, res) => {
  console.log('Request body:', req.body);
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select('password')
    .eq('username', inputUsername)

  console.log("Supabase result:", data)
  console.log("Supabase error:", error)

  if (error) {
    // ถ้ามี error ส่งกลับ status 500 พร้อมข้อความ error
    return res.status(500).json({ error: error.message })
  }

  // ถ้าไม่มี error ส่งข้อมูล data กลับไป
  res.json(data)
})

// sign up
app.post('/add-user/register', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { username, email, password, faculty, year } = req.body;

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password, faculty, year }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'User registered successfully', data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// sign in
app.post('/create/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { data, error } = await supabase
      .from('users')
      .select('password')
      .eq('username', username)

    console.log("Supabase result:", data)
    console.log("Supabase error:", error)

    if (!data) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    const storedPassword = data[0].password;

    if (storedPassword !== password) {
      return res.status(401).json({
        message: 'Incorrect password'
      });
    }

    res.json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

app.get('/shirt/info/get', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shirtInfo')
      .select('*')
      .order('id', { ascending: false }); // เรียงล่าสุดขึ้นก่อน

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ shirts: data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/shirt/info/post', async (req, res) => {
  try {
    console.log('Insert shirt info:', req.body);

    const {
      shirt_name,
      shirt_price,
      shirt_open_date,
      shirt_close_date,
      shirt_detail,
      shirt_url,
      shirt_pic // จาก frontend จะส่งมาหรือไม่ก็ได้
    } = req.body;

    const { data, error } = await supabase
      .from('shirtInfo')
      .insert([{
        shirt_name,
        shirt_price,
        shirt_open_date,
        shirt_close_date,
        shirt_detail,
        shirt_url,
        shirt_pic
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Shirt info added successfully', data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//อันนี้เทสยิงข้อมูล mock นะ
// app.post('/shirt/info/post', async (req, res) => {
//   try {
//     console.log('Mock insert shirt info:', req.body);

//     // เพิ่มข้อมูลเข้า array
//     mockShirts.push(req.body);

//     res.json({
//       message: 'Shirt info added (mocked)',
//       data: req.body
//     });
//   } catch (err) {
//     console.error('Unexpected error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// app.get('/shirt/info/get', async (req, res) => {
//   try {
//     res.json({ shirts: mockShirts });
//   } catch (err) {
//     console.error('Unexpected error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// // sign up
// app.post('/add-user/register', async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("ข้อมูลที่ผู้ลงทะเบียนกรอก" + data);

//     const [results] = await conn.query('INSERT INTO users SET ?', data);

//     res.json({
//       message: 'Insert Success',
//       data: results
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "error something wrong",
//       errorMessage: error.message
//     });
//   }
// });

// // commu get
// app.get('/commu/get', async (req, res) => {
//   try {
//     const [results] = await conn.query('SELECT * FROM commupost ORDER BY postid DESC');

//     res.json(results)
//     console.log(results)

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error while fetching posts",
//       errorMessage: error.message
//     });
//   }
// });

// // commu post
// app.post('/commu/post', async (req, res) => {
//   try {
//     const data = req.body
//     console.log(data)
//     const results = await conn.query('INSERT INTO commupost SET ?', data);

//     res.json({
//       message: 'Insert Success',
//       data: results
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error while creating post",
//       errorMessage: error.message
//     });
//   }
// });

// // commu get
// app.get('/commu/get', async (req, res) => {
//   try {
//     const [results] = await conn.query('SELECT * FROM commupost');

//     res.json(results)
//     // console.log(results)

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error while fetching posts",
//       errorMessage: error.message
//     });
//   }
// });


const port = 8000;
app.listen(port, () => {
  console.log('http server run at : ' + port)
})


