const getID = (()=> {
    let id = 0
    return () => id++
})()

const express = require('express')
const app = express()
const port = 3000

const expressWs = require('express-ws')(app)

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

let rooms = []

app.get('/', (req, res) => {
    res.redirect('/index.html')
})

app.get('/chatroom', (req, res) => {
    res.render('room')
})

app.ws('/chatroom', (ws, req) => {
    const id = getID()
    const users = {
        id,
        ws
    }
    rooms.push(users)
    console.log(`user ${id} connected`)
    ws.on('close', () => {
        console.log(`user ${id} disconnected`)
        rooms = rooms.filter(room => room.id !== id)
    })
    ws.on('message', (msg) => {
        rooms.forEach(room => {
            room.ws.send(JSON.stringify({
                type: 'message',
                id,
                message: msg
            }))
        })
    })
    ws.send(JSON.stringify({
        type: 'connect',
        id
    }))
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
