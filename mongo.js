const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://pamoladize10:${password}@cluster0.p0al7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const content = process.argv[3]
if(process.argv.length === 4){
  const note = new Note({
    content: `${content}`,
    important: false,
  })
  
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}

if(process.argv.length === 3){
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}
console.log(process.argv.length)