
// Importerar dotenv för att gömma känsliga nycklar
import * as dotenv from 'dotenv'
//implementerar dotenv
dotenv.config()
// Express
import express from 'express'
// Hämtar CORS
import cors from 'cors'
//Hämtar postgress sql
import pg from 'pg'
//Hämtar client paket så att kommunikationen mellan server och databas fungerar
import pkg from 'pg'
const { Client } = pkg

import { v4 as uuidv4 } from 'uuid'

dotenv.config();

const app = express();

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cors());

app.use(express.json());

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(path.join(path.resolve(), 'public')));

const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect(function (err) {
    if (err) throw err;
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.json('Root');
});

app.get('/users', async (req, res) => {
    try {
        const allUsers = await db.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params

        const specificUser = await db.query(
            'SELECT * FROM users WHERE user_id = $1',
            [id]
        )

        if (specificUser.rows.length === 1) {
            const user = specificUser.rows[0]
            res.json(user)
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
})

app.post('/login', async (req, res) => {
    const { user_firstname, password } = req.body;

    if (!user_firstname || !password) {
        res.status(400).send('Name or password is missing');
        return;
    }

    const values = [user_firstname, password];

    try {
        const loginUser = await db.query('SELECT * FROM users WHERE user_firstname = $1 AND password = $2', values);

        if (loginUser.rows.length === 1) {
            const user_id = loginUser.rows[0].user_id;
            const token = uuidv4();

            req.session.user = {
                user_id,
                token,
            };

            res.json({ user_id, token });
        } else {
            res.status(400).send('Login failed');
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// Kolla om ett giltigt token finns
app.get('/check-token', async (req, res) => {
    const { token } = req.headers

    if (!token) {
        res.status(401).send('Token saknas')
        return
    }

    try {
        const result = await db.query(
            'SELECT user_id FROM users WHERE token = $1',
            [token]
        )

        if (result.rows.length === 1) {
            const user_id = result.rows[0].user_id
            res.status(200).json({ user_id })
        } else {
            res.status(401).send('Felaktigt Token')
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Fel')
    }
})

// Skapa användare POST
app.post('/users', async (req, res) => {
    const { user_firstname, user_lastname, title, password, image } = req.body;

    if (!user_firstname || !password) {
        res.status(400).send('First name or password is missing');
        return;
    }

    const values = [user_firstname, user_lastname, title, password, image];

    try {
        const result = await db.query('INSERT INTO users(user_firstname, user_lastname, title, password, image) VALUES ($1, $2, $3, $4, $5) RETURNING user_id', values);
        const userId = result.rows[0].user_id;
        res.json({ userId });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// Ändra specifik användare
app.put('/users/:id', async (req, res) => {
    const id = req.params.id

    const { user_firstname, user_lastname, title, password, image } =
        req.body

    const values = [
        user_firstname,
        user_lastname,
        title,
        password,
        image,
        id,
    ]

    await db.query(
        'UPDATE users SET user_firstname = $1, user_lastname = $2, title = $3, password = $4, image = $5 WHERE user_id = $6',

    const values = [user_firstname, user_lastname, title, password, image, id];

    try {
        await db.query('UPDATE users SET user_firstname = $1, user_lastname = $2, title = $3, password = $4, image = $5 WHERE user_id = $6', values);
        res.send('User is updated');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await db.query('DELETE FROM users WHERE user_id = $1', [id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// Alla Meddelanden
app.get('/messages', async (req, res) => {
    try {
        const allMessages = await db.query(
            'SELECT * FROM messages ORDER BY created'
        )

        res.json(allMessages.rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// Skicka nytt meddelande
app.post('/messages', async (req, res) => {
    const { sender_id, recipient_id, message } = req.body;
    const values = [sender_id, recipient_id, message];

    try {
        const result = await db.query('INSERT INTO messages(sender_id, recipient_id, message) VALUES ($1, $2, $3) RETURNING message_id', values);
        const message_id = result.rows[0].message_id;
        res.json({ message_id });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error');
    }
});

app.put('/messages/:id', async (req, res) => {
    const id = req.params.id;
    const { sender_id, recipient_id, message } = req.body;
    const values = [sender_id, recipient_id, message, id];

    try {
        await db.query('UPDATE messages SET sender_id = $1, recipient_id = $2, message = $3 WHERE message_id = $4', values);
        res.send('Message is changed');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// Ta bort meddelande
app.delete('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMessages = await db.query('DELETE FROM messages WHERE message_id = $1', [id]);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

app.listen(8900, () => {
    console.log('Server connected');
});
