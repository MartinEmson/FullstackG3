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

import pkg from 'pg';

const { Client } = pkg;

//Hämtar body-parser (ett middlewear som kan hantera olika request metoder)

import bodyParser from 'body-parser'

//Importerar åath spom gör att vi kan använda statiska filier på valfri plats i vårt projekt

import path from 'path'

//Implemenetrar Express tillsammans med app

const app = express()


//lägger till middlewear

//Bodyparser

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({

    extended: true

}))

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

    console.log('Coneccted to database');

})





// Routes

app.get('/', (req, res) => {

    res.json('hejsan sve')

})




//Alla

app.get('/cities', async (req, res) => {

    try {

        const allBooks = await db.query('SELECT * FROM cities')

        res.json(allBooks.rows)

    } catch (err) {

        console.log(err.message);

    }

})




// Skapa bäcker POST

// app.post('/books', async (req, res) => {

//     const { title, cover, price, about } = req.body

//     const values = [title, cover, price, about]

//     await db.query(

//         'INSERT INTO books(title, cover, price, about) VALUES ($1, $2, $3, $4 )',

//         values

//     )




//     res.send('Book added')

// })




app.post('/cities', async (req, res) => {

    const { name, population } = req.body

    const values = [name, population]

    await db.query(

        'INSERT INTO cities(name, population) VALUES ($1, $2)',

        values

    )




    res.send('City added')

})




app.delete('/books/:id', async (req, res) => {

    try {

        const { id } = req.params

        const deleteBook = await db.query('DELETE FROM books WHERE id = $1', [

            id

        ])

        res.json({ message: 'Book deleted' })

    } catch (err) {

        console.log(err.message);

    }

})


app.put('/books/:id', async (req, res) => {

    const id = req.params.id

    const { title, cover, price, about } = req.body

    const values = [title, cover, price, about, id]

    await db.query(

        'UPDATE books SET title = $1, cover = $2, price = $3, about = $4 WHERE id = $5',

        values

    )

    res.send('Book is changed')

})


app.listen(8900, () => {

    console.log('Server connected');

})
