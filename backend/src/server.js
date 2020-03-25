const express = require("express")
const monogoose = require("mongoose")
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
	io.on('connectRoom', box => {
		socket.join(box)
	})
})

monogoose.connect("mongodb+srv://admin:admin123@cluster0-8keq1.mongodb.net/test?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
})

app.use((req, res, next) => {
	req.io = io

	return next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))

app.use(require("./routes"))

// server.listen(process.env.POST || 3333)

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});