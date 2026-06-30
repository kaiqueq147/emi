import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'mood-data.json')
const PORT = process.env.PORT ?? 3001

let state = { moodId: null, date: null, updatedAt: null }

async function load() {
  try {
    if (existsSync(DATA_FILE)) {
      state = JSON.parse(await readFile(DATA_FILE, 'utf8'))
    }
  } catch {
    // arquivo inválido — começa do zero
  }
}

async function persist() {
  try {
    await writeFile(DATA_FILE, JSON.stringify(state, null, 2))
  } catch (err) {
    console.error('Falha ao salvar mood:', err)
  }
}

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

// Humor só vale para o dia atual; ao virar a meia-noite, reseta.
function currentMood() {
  if (state.date !== todayKey()) {
    return { moodId: null, date: todayKey(), updatedAt: state.updatedAt }
  }
  return state
}

const clients = new Set()

function broadcast() {
  const payload = `data: ${JSON.stringify(currentMood())}\n\n`
  for (const res of clients) {
    res.write(payload)
  }
}

await load()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/mood', (_req, res) => {
  res.json(currentMood())
})

app.post('/api/mood', async (req, res) => {
  const moodId = req.body?.moodId ?? null
  state = { moodId, date: todayKey(), updatedAt: new Date().toISOString() }
  await persist()
  broadcast()
  res.json(currentMood())
})

app.get('/api/mood/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  res.write(`data: ${JSON.stringify(currentMood())}\n\n`)
  clients.add(res)

  const ping = setInterval(() => res.write(': ping\n\n'), 25000)
  req.on('close', () => {
    clearInterval(ping)
    clients.delete(res)
  })
})

app.listen(PORT, () => {
  console.log(`Mood server rodando em http://localhost:${PORT}`)
})
