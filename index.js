const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const Note = require('./models/note')
const PORT = process.env.PORT || 8080



const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)


let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]


  app.get('/notes', (req, res)=> {
    res.json(notes)
  })

  app.get('/api/notes', (req, res) => { 
    Note.find({}).then(notes => {
      res.json(notes)
    })
  })

  app.get('/notes/:id', (req, res) => {
    const id = req.params.id
    const data = notes.find(note => note.id === id)
    if (data) {
        res.json(data)
    } else {
        res.status(404).json({"error":`No such data with id: ${id}`})
    }
  })

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: Boolean(body.important) || false,
    })
    
    note.save().then(savedNote=>response.json(savedNote))
  
    response.json(note)
  })

  app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    Note.findById(id).then(note=>{
      if(note){
        res.json(note)
      }else{
        res.status(494).end()
      }
    }).catch(err=>next(err))
  })

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
  .then(res=>res.status(204).end())
  .catch(err=>next(err))
})

app.patch('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  const note = {
    content: body.content,
    important: body.important
  }
  Note.findByIdAndUpdate(id,note,{new:true, validators:true, context:'query'})
  .then(res=>res.status(201).json(res))
  .catch(err=>next(err))
})

  // eQfKy4xFCdsmhssz
  // pamoladize10
  // mongodb+srv://pamoladize10:eQfKy4xFCdsmhssz@cluster0.p0al7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } 
  
    next(error)
  }
  
app.use(errorHandler)
app.listen(PORT, ()=>console.log(`app listen on port ${PORT}`))