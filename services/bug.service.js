import fs from 'fs'
import { utilService } from './util.service.js'
let bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}) {
    let bugToDisplay = [...bugs]
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugToDisplay = bugToDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity)
        bugToDisplay = bugToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)

    if (filterBy.labels) {
        const labelsToFilter = filterBy.labels
        bugs = bugs.filter((bug) =>
            labelsToFilter.every((label) => bug.labels.includes(label))
        )
    }

    const sortBy = filterBy.sortBy
    if (sortBy.type === 'createdAt') {
        bugs.sort((b1, b2) => (sortBy.desc) * (b1.createdAt - b2.createdAt))
    } else if (sortBy.type === 'title') {
        bugs.sort((b1, b2) => (sortBy.desc) * (b1.title.localeCompare(b2.title)))
    }

    const totalPageSize = Math.ceil(bugs.length / PAGE_SIZE)

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE;
        bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve({ bugs, totalPageSize })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('No bug found')
    else return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[idx] = { ...bugs[idx], ...bugToSave }
    }
    else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugToSave.description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, earum sed corrupti voluptatum voluptatem at.'
        bugs.push(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/bug.json', JSON.stringify(bugs, null, 2), (err) => {
            if (err) {
                console.log(err);
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}