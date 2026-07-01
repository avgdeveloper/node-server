const { useState, useEffect } = React

export function LabelSelector({ onLabelChange }) {
    const [selectedLabels, setSelectedLabels] = useState([])

    const labelsOptions = ['critical', 'need-CR', 'dev-branch', 'famous', 'high', 'popular']

    useEffect(() => {
        onLabelChange(selectedLabels)
    }, [selectedLabels])

    function handleLabelChange(event) {
        const label = event.target.value
        if (event.target.checked) {
            setSelectedLabels(prevLabels => [...prevLabels, label])
        } else {
            setSelectedLabels(prevLabels => prevLabels.filter(l => l !== label))
        }
    }

    return (
        <div className="label-selector">
            {labelsOptions.map(label => (
                <div key={label}>
                    <input
                        type="checkbox"
                        value={label}
                        checked={selectedLabels.includes(label)}
                        onChange={handleLabelChange}
                        id={`checkbox-${label}`}
                    />
                    <label htmlFor={`checkbox-${label}`}>{label}</label>
                </div>
            ))}
        </div>
    )
}
