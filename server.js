const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { default: axios } = require('axios')
const { setBrightness, getMonitors } = require('./utils')
const { monitorEventLoopDelay } = require('perf_hooks')

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
  console.log(req.query)
  res.send(brightness)
})

app.get('/getmonitors', async (req, res) => {
  const monitors = await getMonitors()
  res.send(monitors)
})

app.get('/set/:value', async (req, res) => {
  const { monitorName } = req.query

  await setBrightness(monitorName, req.params.value)
  res.send('done')
})


app.listen(4000, () => console.log('http://localhost:4000'))