require('dotenv').config()

// const mysql = require('mysql2/promise')

const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
// app.use(cors({
//   credentials: true,
//   origin: ['']
// }))
app.use(bodyParser.json())
app.use(express.json());

// security **
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const session = require('express-session')


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const secret = process.env.JWT_SECRET;
const port = process.env.PORT || 8000;


if (!supabaseServiceRoleKey) {
  console.error("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Please set it in your .env file!");
}
const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); // admin client for private buckets ka man pen public fake

let cachedShirts = null;
let cacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 5;

// sign up
app.post('/add-user/register', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { username, email, password, faculty, year } = req.body;

    const { data: Checkemail } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle() // ถ้าใช้ซิงเกิ้ลเฉยๆไม่เจอมันจะ error

    const { data: Checkusername } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle()

    if (Checkemail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (Checkusername) {
      return res.status(400).json({ error: 'Username already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 8)
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password: passwordHash, faculty, year }])
      .select('user_id, username, email');

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
    const { username, email, password } = req.body;

    let query = supabaseAdmin
      .from('users')
      .select('user_id, username, email, password, faculty, year');

    if (email && typeof email === 'string') {
      query = query.eq('email', email);
    } else {
      query = query.eq('username', username);
    }

    const { data, error } = await query

    console.log("data :", data)
    console.log("error:", error)

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const supabase_user_data = data[0];
    const supabase_password = supabase_user_data.password;

    const match = await bcrypt.compare(password, supabase_password)

    if (!match) {
      return res.status(401).json({ message: 'Password Incorrect😭' })
    }

    // jwt token
    const token = jwt.sign({ email: supabase_user_data.email, role: 'admin' }, secret, { expiresIn: '5h' })

    res.json({
      success: true,
      user: {
        user_id: supabase_user_data.user_id,
        username: supabase_user_data.username,
        faculty: supabase_user_data.faculty,
        year: supabase_user_data.year,
        token
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', message: error.message });
  }
});


app.get('/authen/users', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let authToken = ''


    if (authHeader) {
      authToken = authHeader.split(' ')[1]
    }
    const veri = jwt.verify(authToken, secret)
    console.log('Auth Token:', veri);

    res.json({
      success: true,
      message: "Token is valid",
      user: veri,
    });

  } catch (error) {
    console.error("Auth failed:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }

})

// commu post
app.post('/commu/post', async (req, res) => {

  const { user_id, title, detail, contact } = req.body;
  console.log(title, detail, contact)

  const { data, error } = await supabaseAdmin
    .from('commuPost')
    .insert([{ user_id, title, detail, contact }])
    .select()

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
    const { data, error } = await supabaseAdmin
      .from('commuPost')
      .select('post_id, title, detail, contact, user_id')
      .order('post_id', { ascending: false }); // เรียงจากล่าสุดก่อน

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

//Profile: 

//Profile: get post from commu
app.get('/commu/get/by-user/:user_id', async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const { data, error } = await supabaseAdmin
      .from('commuPost')
      .select('post_id, title, detail, contact, user_id')
      .eq('user_id', user_id)
      .order('post_id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Profile: edit post
app.put('/commu/post/:post_id', async (req, res) => {
  try {
    const post_id = Number(req.params.post_id);
    const { title, detail, contact, user_id } = req.body;
    const uid = Number(user_id);

    if (!uid) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('commuPost')
      .update({ title, detail, contact })
      .eq('post_id', post_id)
      .eq('user_id', uid)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(403).json({ error: 'Not found or not the owner' });
    }

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Profile: delete post
app.delete('/commu/delete/:post_id', async (req, res) => {
  try {
    const post_id = Number(req.params.post_id);
    const { user_id } = req.body;
    const uid = Number(user_id);

    if (!uid) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const { error } = await supabaseAdmin
      .from('commuPost')
      .delete()
      .eq('post_id', post_id)
      .eq('user_id', uid);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Profile: fav jersey >> user profile
app.get('/shirt/fav/get/:user_id', async (req, res) => {
  try {
    const uid = Number(req.params.user_id);
    if (!uid) return res.status(400).json({ error: 'user_id is required' });

    const { data, error } = await supabaseAdmin
      .from('favShirt')
      .select('shirt_id, shirt_name, shirt_pic')
      .eq('user_id', uid)
      .order('fav_id', { ascending: false });

    if (error) {
      console.error('fav list error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error('error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/shirt/info/get', async (req, res) => {
  try {

    
    const now = Date.now();
    console.log('Request received at', new Date(now).toLocaleTimeString());

    if (cachedShirts && now - cacheTime < CACHE_DURATION) {
      console.log('Returning cached shirts!', cachedShirts?.length);
      return res.json(cachedShirts);
    }

    const { data, error } = await supabaseAdmin
      .from('shirtInfo')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: error.message });
    }
    // เช็คว่ามีข้อมูลมั้ย
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No shirt info found' });
    }

    cachedShirts = data;
    cacheTime = now;

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
    let { data, error } = await supabaseAdmin
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
      shirt_pic
    } = req.body;

    const { data: newShirt, error } = await supabaseAdmin
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
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, shirt_id: newShirt.id });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/shirt/fav/post', async (req, res) => {
  try {
    console.log('Insert shirt info:', req.body);

    const {
      shirt_name,
      shirt_pic,
      user_id,
      shirt_id
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from('favShirt')
      .insert([{
        shirt_name,
        shirt_pic,
        user_id,
        shirt_id
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Shirt info added yayy', data });
  } catch (err) {
    console.error('error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/shirt/fav/del', async (req, res) => {
  try {
    console.log('Del shirt info:', req.body);

    const {
      user_id,
      shirt_id
    } = req.body;


    const { error } = await supabaseAdmin
      .from('favShirt')
      .delete()
      .eq('user_id', Number(user_id))
      .eq('shirt_id', Number(shirt_id));


    if (error) {
      console.error('delete error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Shirt info delete T T' });
  } catch (err) {
    console.error('error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/shirt/fav/check', async (req, res) => {
  try {
    console.log('shirt info:', req.body);

    const {
      user_id,
      shirt_id
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from('favShirt')
      .select('*')
      .eq('user_id', Number(user_id))
      .eq('shirt_id', Number(shirt_id));

    if (error) {
      console.error('checck error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (data.length != 0) {
      res.json(true);
    } else {
      res.json(false);
    }

  } catch (err) {
    console.error('error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//tags
app.post('/shirt/tag/add', async (req, res) => {
  try {
    const { shirt_id, tag_name } = req.body;

    //หา tag ว่ามีอยู่มั้ย
    let { data: tagData, error: tagError } = await supabaseAdmin
      .from('tags')
      // .select('tag_id')
      .select()
      .eq('tag_name', tag_name)
      .maybeSingle();

    if (tagError) throw tagError;
    if (!shirt_id) {
      throw new Error('shirt_id is null');
    }

    //ถ้าไม่มีก็สร้างใหม่
    if (!tagData) {
      const { data: newTag, error: createError } = await supabaseAdmin
        .from('tags')
        .insert([{ tag_name }])
        .select()
        .single();

      if (createError) throw createError;
      tagData = newTag;
    }

    //เชื่อมเสื้อกับแท็ก
    const { error: linkError } = await supabaseAdmin
      .from('shirt_tags')
      .insert([{ shirt_id, tag_id: tagData.tag_id }]);

    if (linkError) throw linkError;

    res.json({ success: true, message: 'Tag added successfully' });
  } catch (err) {
    console.error('Add tag error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//ดึงแท้กเสื้อ
app.get('/shirt/tag/get/:shirt_id', async (req, res) => {
  try {
    const { shirt_id } = req.params;

    //ดึง tag_id ทั้งหมดของเสื้อตัวเน้จ
    const { data: shirtTags, error: shirtTagsError } = await supabaseAdmin
      .from('shirt_tags')
      .select('tag_id')
      .eq('shirt_id', shirt_id);

    if (shirtTagsError) throw shirtTagsError;

    // ถ้าเสื้อนี้ไม่มีแท้ก
    if (!shirtTags || shirtTags.length === 0) {
      return res.json([]);
    }

    // แปลง tag_id ที่ได้เป็น array
    const tagIds = shirtTags.map(item => item.tag_id);

    // ดึงชื่อแท็กทั้งหมดจากตาราง tags
    const { data: tagsData, error: tagsError } = await supabaseAdmin
      .from('tags')
      .select('tag_name')
      .in('tag_id', tagIds);

    if (tagsError) throw tagsError;

    res.json(tagsData);
  } catch (err) {
    console.error('Get tags error:', err);
    res.status(500).json({ error: err.message });
  }
});



app.get('/category/:folder/info/get', async (req, res) => {
  try {
    const folder = req.params.folder;
    console.log("Request for folder:", folder)

    // เช็คว่าเชื่อม supabase ได้มั้ย
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase dead (not connect)' });
    }

    // เช็คว่าชื่อโฟลเดอร์จากพารัมถูกมั้ย
    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({ error: 'folder name invalid' });
    }

    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('closet')
      .list(folder, { limit: 100, offset: 0 });

    // เช็ค error จากการดึงข้อมูล
    if (listError) {
      console.error('Supabase list error:', listError);
      return res.status(500).json({ error: listError.message });
    }


    // ไม่มีไฟล์ในโฟลเดอร์เลยให้ส่ง array ว่าง [] ไป
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

          // error ระหว่างสร้าง url
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

app.post('/shirt/fillter', async (req, res) => {
  try {

    let { selectedTagIds = [], minPrice, maxPrice } = req.body;

    minPrice = minPrice ?? 0;
    maxPrice = maxPrice ?? 10000;

  
    if (!Array.isArray(selectedTagIds)) {
      return res.status(400).json({ error: 'selectedTagIds must be an array' });
    }

    let { data: shirts, error: priceError } = await supabaseAdmin
      .from('shirtInfo')
      .select('*')
      .gte('shirt_price', minPrice)
      .lte('shirt_price', maxPrice)
      .order('id', { ascending: false });


    if (priceError) return res.status(500).json({ error: priceError.message });

    if (selectedTagIds.length > 0) {
      const { data: tagData, error: tagError } = await supabaseAdmin
        .from('shirt_tags')
        .select('shirt_id')
        .in('tag_id', selectedTagIds);



      if (tagError) return res.status(500).json({ error: tagError.message });

      const tagShirtIds = new Set(tagData.map(d => d.shirt_id));

      shirts = shirts.filter(shirt => tagShirtIds.has(shirt.id));
    }

    res.json(shirts || []);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log('http server run at : ' + port)
})