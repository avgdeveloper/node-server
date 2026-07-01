const { useState, useEffect } = React
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [totalPageSize, setTotalPageSize] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(bugService.getDefaultSortBy())

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then(({ bugs, totalPageSize }) => {
                setTotalPageSize(totalPageSize)
                setBugs(bugs)
            })
            .catch(err => console.log('err:', err))
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy, pageIdx: 0 }))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('from remove bug', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
        }
        bugService.save(bug)
            .then(savedBug => {
                setBugs(prevBugs => [...prevBugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('from add bug', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        if (!severity) return
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                setBugs(prevBugs =>
                    prevBugs.map(currBug =>
                        currBug._id === savedBug._id ? savedBug : currBug
                    )
                )
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('from edit bug', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSetSort(sortBy) {
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: prevFilter.pageIdx + diff,
        }))
    }

    function onDownloadBugsPdf() {
        bugService.downloadBugsPdf().then(() => {
            showSuccessMsg(`Bugs PDF download!`)
        })
    }

    return (
        <div>
            <main className="main-layout">
                <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
                <BugSort onSetSort={onSetSort} sortBy={sortBy} />


                <button className="btn" onClick={onAddBug}>
                    Add Bug ⛐
                </button>
                <div className="container">

                    <div className="paging flex">
                        <button
                            disabled={filterBy.pageIdx === 0}
                            className="btn"
                            onClick={() => {
                                onChangePageIdx(-1)
                            }}
                        >
                            Previous
                        </button>
                        <span>{filterBy.pageIdx + 1}</span>
                        <button
                            disabled={filterBy.pageIdx === totalPageSize - 1}
                            className="btn"
                            onClick={() => {
                                onChangePageIdx(1)
                            }}
                        >
                            Next
                        </button>
                    </div>
                    <button className="btn-download btn" onClick={onDownloadBugsPdf}>
                        Download PDF
                    </button>
                </div>

                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />

            </main>
        </div>
    )
}
