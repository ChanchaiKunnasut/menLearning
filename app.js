const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/menLearning')
let db = mongoose.connection

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB')
})
// Check for DB errors
db.on('error', err => {
  console.log(err)
})

// init app
const app = express()

// Bring in Models
let Article = require('./models/article')

// Load View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      })
    }
  })
})

// Get Single Article
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err)
    } else {
      res.render('article', {
        article: article
      })
    }
  })
})

// Add Route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  })
})

// Add Submit POST Route
app.post('/articles/add', (req, res) => {
  let article = new Article()
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  article.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
})

// Update Submit POST Route
app.post('/articles/edit/:id', (req, res) => {
  let article = {}
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  let query = {_id: req.params.id}

  Article.update(query, article, (err) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
})

app.delete('/article/:id', (req, res) => {
  let query = {_id: req.params.id}

  Article.remove(query, (err) => {
    if (err) {
      console.log(err)
    } else {
      res.send('Success')
    }
  })
})

// Load Edit Form
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err)
    } else {
      res.render('edit_article', {
        title: 'Edit Article',
        article: article
      })
    }
  })
})

// Start Server
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
