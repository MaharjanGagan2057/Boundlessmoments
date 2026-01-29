// server.js
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const session = require("express-session");

// ------------------------- SETUP -------------------------

// Setup session middleware
app.use(session({
    secret: "mySecretKey123",
    resave: false,
    saveUninitialized: false
}));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads folder");
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, HTML, images)
app.use(express.static(__dirname));
app.use("/uploads", express.static(uploadsDir));

// ------------------------- DATABASE -------------------------

const { Pool } = require('pg');
const pool = new Pool({
    host: 'aws-1-ap-southeast-1.pooler.supabase.com',
    database: 'postgres',
    user: 'postgres.ottwocqjqqcyunxytlji',
    password: 'Gagan2057#',
    port: 6543
});

pool.connect(err => {
    if (err) throw err;
    console.log("Connected to PostgreSQL");
});

// ------------------------- MIDDLEWARE -------------------------

// Middleware to check admin login
function checkAdminLogin(req, res, next) {
    if (req.session && req.session.user) {
        next(); // user logged in, continue
    } else {
        res.redirect("/login"); // not logged in, go to login
    }
}

// Protect all /admin routes
app.use("/admin", checkAdminLogin);

// ------------------------- ROUTES -------------------------

// Home
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "home.html")));
app.get("/home", (req, res) => res.sendFile(path.join(__dirname, "home.html")));

// ------------------------- LOGIN / SIGNUP -------------------------

// Login page
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));

// Login POST
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    pool.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
    .then(result => {
        if (result.rows.length > 0) {
            req.session.user = { username };
            res.redirect("/admin");
        } else {
            res.status(401).send("Invalid credentials");
        }
    })
    .catch(err => { console.error(err); res.status(500).send("Database error"); });
});

// Signup page
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "signup.html")));

// Signup POST
app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    pool.query("SELECT * FROM users WHERE username=$1", [username])
        .then(result => {
            if (result.rows.length > 0) return res.status(400).send("Username already exists!");
            return pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
        })
        .then(() => res.redirect("/login"))
        .catch(err => { console.error(err); res.status(500).send("Server error"); });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect("/login");
    });
});

// ------------------------- ADMIN PAGE -------------------------

app.get("/admin", (req, res) =>
    res.sendFile(path.join(__dirname, "admin.html"))
);


// Admin Users Data
app.get("/admin/users/data", checkAdminLogin, (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading users"));
});

// Admin Users count
app.get("/admin/users/count", checkAdminLogin, async (req, res) => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM users");
        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ count: 0 });
    }
});

// Admin Messages Data
app.get("/admin/messages/data", checkAdminLogin, (req, res) => {
    pool.query("SELECT * FROM messages ORDER BY id ASC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading messages"));
});

// Admin Messages count
app.get("/admin/messages/count", checkAdminLogin, async (req, res) => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM messages");
        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ count: 0 });
    }
});

// Admin Blogs Data
app.get("/admin/blogs/data", checkAdminLogin, (req, res) => {
    pool.query("SELECT * FROM blogs ORDER BY id DESC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading blogs"));
});

// Admin Blogs count
app.get("/admin/blogs/count", checkAdminLogin, async (req, res) => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM blogs");
        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ count: 0 });
    }
});


// ------------------------- CONTACT -------------------------

app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "contact.html")));
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).send("All fields are required");

    pool.query("INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)", [name, email, message])
        .then(() => res.send("Message sent successfully!"))
        .catch(err => res.status(500).send("Error sending message"));
});

// ------------------------- USERS -------------------------

app.get("/users", (req, res) => res.sendFile(path.join(__dirname, "users.html")));
app.get("/users/data", (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading users"));
});
app.get("/users/delete/:id", (req, res) => {
    pool.query("DELETE FROM users WHERE id=$1", [req.params.id])
        .then(() => { if (!res.headersSent) res.redirect("/users"); })
        .catch(err => console.log(err));
});

// ------------------------- BLOGS -------------------------

// Multer setup for blogs
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Blog routes
app.get("/blogs", (req, res) => res.sendFile(path.join(__dirname, "blogs.html")));
app.get("/blogs/data", (req, res) => {
    pool.query("SELECT * FROM blogs ORDER BY id DESC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading blogs"));
});
app.get("/blogs/add", (req, res) => res.sendFile(path.join(__dirname, "addblogs.html")));

app.post("/blogs/add", upload.single("image"), (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!title || !content) return res.status(400).send("All fields required");

    pool.query("INSERT INTO blogs (title, content, image) VALUES ($1, $2, $3)", [title, content, image])
        .then(() => res.redirect("/blogs?added=1"))
        .catch(err => { console.error(err); res.status(500).send("Error adding blog"); });
});

// DELETE blog (admin)
app.delete("/blogs/delete/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM blogs WHERE id = $1", [id])
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});



// Admin blogs
app.get("/adminblogs", (req, res) => res.sendFile(path.join(__dirname, "adminblogs.html")));

//admin messages
app.get("/messages", (req, res) => res.sendFile(path.join(__dirname, "messages.html")));

// Admin messages data
app.get("/admin/messages/data", checkAdminLogin, (req, res) => {
    pool.query("SELECT * FROM messages ORDER BY id DESC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading messages"));
});
//messages
app.get("admin/messages", (req, res) => res.sendFile(path.join(__dirname, "messages.html")));

// Admin messages page
app.get("/admin/messages", checkAdminLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "messages.html"));
});

// Admin messages data (JSON)
app.get("/contact/data", checkAdminLogin, (req, res) => {
    pool.query("SELECT * FROM messages ORDER BY DESC")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).send("Error loading messages"));
});





// Admin Employees Page
app.get("/employees", checkAdminLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "employees.html"));
});

// Employees data
app.get("/employees/data", checkAdminLogin, (req, res) => {
  pool.query("SELECT * FROM employees ORDER BY id ASC")
    .then(result => res.json(result.rows))
    .catch(err => res.status(500).send("Error loading employees"));
});

// Add Employee Page
app.get("/employees/add", checkAdminLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "addemployees.html"));
});

// Add employee POST
app.post("/employees/add", checkAdminLogin, (req, res) => {
  const { name, position, department, salary } = req.body;
  if (!name || !position || !department || !salary) 
      return res.status(400).send("All fields are required");

  pool.query("INSERT INTO employees (name, position, department, salary) VALUES ($1,$2,$3,$4)", 
             [name, position, department, salary])
      .then(() => res.redirect("/employees"))
      .catch(err => res.status(500).send("Error adding employee"));
});

// Delete employee
app.get("/employees/delete/:id", checkAdminLogin, (req, res) => {
  pool.query("DELETE FROM employees WHERE id=$1", [req.params.id])
      .then(() => res.redirect("/employees"))
      .catch(err => res.status(500).send("Error deleting employee"));
});

//edit employee
app.get("/employees/edit/:id", checkAdminLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "editemployees.html"));
});

app.post("/employees/edit/:id", checkAdminLogin, (req, res) => {
  const { name, position, department, salary } = req.body;
  if (!name || !position || !department || !salary) 
      return res.status(400).send("All fields are required");

  pool.query("UPDATE employees SET name=$1, position=$2, department=$3, salary=$4 WHERE id=$5", 
             [name, position, department, salary, req.params.id])
      .then(() => res.redirect("/employees"))
      .catch(err => res.status(500).send("Error updating employee"));
});


//admin portfolio
app.get("/addportfolio", (req, res) => res.sendFile(path.join(__dirname, "addportfolio.html")));


//admingallery
app.get("/admin/addgallery", (req, res) => res.sendFile(path.join(__dirname, "addgallery.html")));




//portfolio
app.get("/portfolio", (req, res ) => res.sendFile(path.join(__dirname, "portfolio.html")));



//gallery
app.get("/gallery", (req, res) => res.sendFile(path.join(__dirname, "gallery.html")));


//experience
app.get("/experience", (req, res) => res.sendFile(path.join(__dirname, "experience.html")));

// ------------------------- SERVER START -------------------------

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
