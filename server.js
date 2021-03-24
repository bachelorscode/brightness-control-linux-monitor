const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { default: axios } = require('axios')
const { setBrightness, getMonitors } = require('./utils')

const app = express()
app.use(cors())
app.use(express.static(__dirname + '/public'))

setInterval(async () => {
  await axios.get('http://localhost:4000/get')
}, 3000)


app.get('/get', async (req, res) => {
  const value = fs.readFileSync(__dirname + '/value.json')
  const { brightness } = JSON.parse(value.toString())
  const monitor = await getMonitors()
  await setBrightness(monitor[0], brightness)
  res.send(brightness)
})

app.get('/set/:value', async (req, res) => {
  const monitor = await getMonitors()
  await setBrightness(monitor[0], req.params.value)
  res.send('done')
})


app.listen(4000, () => console.log('http://localhost:4000'))