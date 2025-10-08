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



console.log("SUPABASE_SERVICE_ROLE_KEY =", process.env.SUPABASE_SERVICE_ROLE_KEY)

const supabaseUrl = 'https://zdhjexmsbgozpxroeaud.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaGpleG1zYmdvenB4cm9lYXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxODU3NTUsImV4cCI6MjA3Mzc2MTc1NX0.E_NmaPHl2jK_h8CTHqzfF5K8cTUMehs7Bf9nHdjLizM";
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaGpleG1zYmdvenB4cm9lYXVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE4NTc1NSwiZXhwIjoyMDczNzYxNzU1fQ.y2rLVTGLD5anVMLup17ib5RqS7XrekDr4XVE8Pa2kts';
if (!supabaseServiceRoleKey) {
  console.error("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Please set it in your .env file!");}
const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); // admin client for private buckets ka man pen public fake


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

    res.json({ success: true, message: "Login successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// commu post
app.post('/commu/post', async (req, res) => {

  const { user_id, title, detail, contact } = req.body;
  console.log(title, detail, contact)

  const { data, error } = await supabase
    .from('commuPost')
    .insert([{ user_id, title, detail, contact }])
    .select()

  console.log(data)
  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json({
    message: 'Insert Success',
    data: data
  });
});

//commu get
app.get('/commu/get', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('commuPost')
      .select('post_id, title, detail, contact, user_id')
      .order('post_id', { ascending: false }); // เรียงจากล่าสุดก่อน

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

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

    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/shirt/info/get/:id', async (req, res) => {

  let id = req.params.id
  console.log(id)
  try {
    let { data, error } = await supabase
      .from('shirtInfo')
      .select('*')
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
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

app.get('/category/:folder/info/get', async (req, res) => {
  try {
    const folder = req.params.folder;
    console.log("Request for folder:", folder)

    // check private key
    if (!supabaseServiceRoleKey) {
      return res.status(500).json({ error: 'Service Role Key not configured' });
    }
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('closet')
      .list(folder, { limit: 100, offset: 0 });
    if (listError) {
      console.error('Supabase list error:', listError);
      return res.status(500).json({ error: listError.message });
    }
    if (!files || files.length === 0) {
      console.log(`No files found in folder ${folder}`);
      return res.json([]);
    }

    // สร้าง signed URL ให้ไฟล์ทุกไฟล์
    const images = await Promise.all(
      files
        .filter(f => f.name.match(/\.(jpg|jpeg|png|webp|jfif)$/i))
        .map(async file => {
          const { data: signedURLData, error: urlError } = await supabaseAdmin.storage
            .from('closet')
            .createSignedUrl(`${folder}/${file.name}`, 60 * 60); //สร้าบแบบใช้ชั่วคราวได้ ประมาณ 1 ชม
          if (urlError) {
            console.error('Signed URL error:', urlError);
            return null;
          }
          return {
            name: file.name,
            url: signedURLData.signedUrl,
          };
        })
    );

    res.json(images.filter(Boolean));
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


