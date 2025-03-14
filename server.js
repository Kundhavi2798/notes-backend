const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const bodyParser = require("express.json");


dotenv.config({ path: './settings.env' });
//
// const app = express();
// app.use(cors()); // Allow frontend requests
// app.use(bodyParser()); // Parse JSON requests

const app = express();
app.use(cors());
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000", // Change to your frontend URL
        methods: "GET,POST,PUT,DELETE",
        credentials: true, // Allow cookies if needed
    })
);

// app.use(bodyParser());

// PostgreSQL Connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        dialectOptions: { ssl: { require: false, rejectUnauthorized: false } },
        logging: false
    }
);

// User Model
const User = sequelize.define('User', {
    user_id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    user_name: { type: DataTypes.STRING, allowNull: false },
    user_email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
});

// Notes Model
const Note = sequelize.define('Note', {
    note_id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    note_title: { type: DataTypes.STRING, allowNull: false },
    note_content: { type: DataTypes.TEXT, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false }
});

User.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(User, { foreignKey: 'user_id' });

sequelize.sync()
    .then(() => console.log('✅ Database synced'))
    .catch(err => console.error('❌ Sync failed:', err));

const generateToken = (userId) => {
    return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


// Register User
app.post("/register", async (req, res) => {
    const { user_name, user_email, password } = req.body;

    if (!user_name || !user_email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ user_name, user_email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user_id: newUser.user_id });
});


// Login User
app.post("/login", async (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { user_email } });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.user_id); // Use the correct user_id
    res.json({ token, user_id: user.user_id, message: "User logged in successfully" });
});


// Get All Notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Create a Note
// Create a Note
app.post('/notes', async (req, res) => {
    try {
        const { note_title, note_content, user_id } = req.body;
        console.log("Received note data:", { note_title, note_content, user_id });  // Log incoming data

        const note = await Note.create({ note_title, note_content, user_id });
        res.json(note);
    } catch (error) {
        console.error("Error saving note:", error);  // Log the error on server-side
        res.status(400).json({ error: error.message });
    }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
