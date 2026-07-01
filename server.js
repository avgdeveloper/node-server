import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

//* Read bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        labels: req.query.labels ? JSON.parse(req.query.labels) : '',
        minSeverity: +req.query.minSeverity || 0,
        sortBy: req.query.sortBy ? JSON.parse(req.query.sortBy) : {}
    }

    if (req.query.pageIdx || req.query.pageIdx === 0)
        filterBy.pageIdx = +req.query.pageIdx

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot load bugs')
        })
})

//* Read bug
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugIds = req.cookies.visitedBugIds || []
    if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
    if (visitedBugIds.length > 3)
        return res.status(401).send('Wait for a bit')

    bugService.getById(bugId)
        .then(bug => {
            res.cookie('visitedBugIds', visitedBugIds, { maxAge: 1000 * 7 })
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

//* Add bug 
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        labels: req.body.labels
    }

    bugService.save(bugToSave)
        .then((savedBug) => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })

})

//* Edit bug 
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        labels: req.body.labels
    }

    bugService.save(bugToSave)
        .then((savedBug) => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })

})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send("file removed!"))
        .catch(err => {
            loggerService.error('Cannot renove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.post('/api/bug/pdf', (req, res) => {
    bugService.getPdf()
        .then((result) => res.send(result))
        .catch(err => {
            loggerService.error('Cannot download Buds Pdf', err)
            res.status(400).send('Cannot download Buds Pdf')
        })
})

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

// app.get('/', (req, res) => {
//     res.send({ title: 'Hello And Welcome' })
// })

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)