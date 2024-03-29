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




//Hämtar body-parser (ett middlewear som kan hantera olika request metoder)




import bodyParser from 'body-parser'




//Importerar åath spom gör att vi kan använda statiska filier på valfri plats i vårt projekt




import path from 'path'




//Implemenetrar Express tillsammans med app




const app = express()




//lägger till middlewear




//Bodyparser




app.use(bodyParser.json())




app.use(

    bodyParser.urlencoded({

        extended: true

    })

)




//Cors




app.use(cors())




//express




app.use(express.json())




// Förbättrar cors kommunikation




app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')




    response.header('Access-Control-Allow-Headers', 'Content-Type')




    next()

})




// Använder path för att komma åt våra statiska filer, i detta fallet i vår public mapp i vår front-end




app.use(express.static(path.join(path.resolve(), 'public')))




//Importerar min databas




const db = new Client({

    host: process.env.DB_HOST,




    user: process.env.DB_USERNAME,




    password: process.env.DB_PASSWORD,




    databas: process.env.DB_NAME,




    port: process.env.DB_PORT

})




//Errorfunktion




db.connect(function (err) {

    if (err) throw err




    console.log('Connected to database')

})




// Routes




app.get('/', (req, res) => {

    res.json('Root')

})




//Alla användare

app.get('/users', async (req, res) => {

    try {

        const allUsers = await db.query('SELECT * FROM users')




        res.json(allUsers.rows)

    } catch (err) {

        console.log(err.message)

    }

})




// Specifik användare

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

            res.status(404).json({ error: 'Användaren finns inte' })

        }

    } catch (err) {

        console.log(err.message)

    }

})




// Logga in

app.post('/login', async (req, res) => {

    const { user_firstname, password } = req.body




    if (!user_firstname || !password) {

        res.status(400).send('Namn eller Lösenord saknas')

        return

    }




    const values = [user_firstname, password]




    try {

        const loginUser = await db.query(

            'SELECT * FROM users WHERE user_firstname = $1 AND password = $2',

            values

        )




        if (loginUser.rows.length === 1) {

            const user_id = loginUser.rows[0].user_id

            const token = uuidv4()




            await db.query('UPDATE users SET token = $1 WHERE user_id = $2', [

                token,

                user_id

            ])




            res.json({ user_id, token })

        } else {

            res.status(400).send('Inloggning misslyckades')

        }

    } catch (err) {

        console.log(err.message)

        res.status(500).send('Serverfel')

    }

})




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
    const { user_firstname, password } = req.body;

    if (!user_firstname || !password) {
        res.status(400).send('Missing required fields');
        return;
    }

    try {
        const token = uuidv4(); // Generate a new token for the user

        await db.query(
            'INSERT INTO users(user_firstname, password, token) VALUES ($1, $2, $3)',
            [user_firstname, password, token]
        );

        res.json({ token }); // Return the token in the response
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding user');
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




        values

    )




    res.send('User is updated')

})




// Ta bort användare

app.delete('/users/:id', async (req, res) => {

    try {

        const { id } = req.params




        const deleteUser = await db.query(

            'DELETE FROM users WHERE user_id = $1',

            [id]

        )




        res.json({ message: 'User deleted' })

    } catch (err) {

        console.log(err.message)

    }

})




// Alla Meddelanden

app.get('/messages', async (req, res) => {

    try {

        const allMessages = await db.query(

            'SELECT * FROM messages ORDER BY created'

        )




        res.json(allMessages.rows)

    } catch (err) {

        console.log(err.message)

    }

})




// Skicka nytt meddelande

app.post('/messages', async (req, res) => {

    const { sender_id, recipient_id, message } = req.body;

    const values = [sender_id, recipient_id, message];




    try {

        const result = await db.query(

            'INSERT INTO messages(sender_id, recipient_id, message) VALUES ($1, $2, $3) RETURNING message_id',




            values

        );




        const message_id = result.rows[0].message_id;

        res.json({ message_id });

    } catch (error) {

        console.log(error.message);

        res.status(500).send('Error')

    }

});




// Ändra meddelande

app.put('/messages/:id', async (req, res) => {

    const id = req.params.id




    const { sender_id, recipient_id, message } = req.body




    const values = [sender_id, recipient_id, message, id]




    await db.query(

        'UPDATE messages SET sender_id = $1, recipient_id = $2, message = $3 WHERE message_id = $4',




        values

    )




    res.send('Message is changed')

})




// Ta bort meddelande

app.delete('/messages/:id', async (req, res) => {

    try {

        const { id } = req.params




        const deleteMessages = await db.query(

            'DELETE FROM messages WHERE message_id = $1',

            [id]

        )




        res.json({ message: 'Message deleted' })

    } catch (err) {

        console.log(err.message)

    }

})




app.listen(8900, () => {

    console.log('Server connected')

})
