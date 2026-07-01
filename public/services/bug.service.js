
import { storageService } from './async-storage.service.js'

const BASE_URL = `/api/bug/`
const STORAGE_KEY = 'bugDB'
let gPageIdx = 0



export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultSortBy,
    downloadBugsPdf
}
// AFTER REST!!

function query(filterBy = {}, sortBy = {}) {
    const filterAndSort = { ...filterBy, sortBy }
    return axios.get(BASE_URL, { params: filterAndSort }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)
}


function downloadBugsPdf() {
    return axios.post(BASE_URL + 'pdf').then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '', labels: '', pageIdx: 0 }
}

function getDefaultSortBy() {
    return { type: '', desc: 1 }
}
