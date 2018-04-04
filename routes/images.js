const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/image', (req, res) => {
  fs.readFile('./img/05-8.jpg', (err, data) => {
    if (err) {
      console.log(err)
    }
    res.writeHead(200, {'Content-Type': 'image/jpeg'})
    res.end(data, 'binary') // Send the file data to the browser.
  })
})

module.exports = router
