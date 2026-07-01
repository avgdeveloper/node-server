import { utilService } from '../services/util.service.js'
import { LabelSelector } from './LabelSelect.jsx'

const { useState, useEffect, useRef } = React

export function BugFilter({ onSetFilter, filterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700)).current

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            [field]: value,
        }))
    }

    function onLabelChange(selectedLabels) {
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            labels: selectedLabels,
        }))
    }

    const { minSeverity, txt } = filterByToEdit
    return (
        <form className="bug-filter">
            <h3>Filter Bugs</h3>

            <div className="filter-container">
                <div>
                    <input
                        className="filter-input"
                        type="text"
                        id="txt"
                        name="txt"
                        value={txt}
                        placeholder="Enter text here..."
                        onChange={handleChange}
                    />
                    <input
                        placeholder="Enter severity here.."
                        className="filter-input"
                        type="number"
                        id="minSeverity"
                        name="minSeverity"
                        value={minSeverity || ''}
                        onChange={handleChange}
                    />
                </div>
                <LabelSelector onLabelChange={onLabelChange} />
            </div>
        </form>
    )
}
