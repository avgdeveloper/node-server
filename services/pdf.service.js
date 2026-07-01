import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = {
    buildBugsPDF
}

function buildBugsPDF(bugs, filename = 'all-bugs.pdf') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        const stream = fs.createWriteStream(filename)

        stream.on('finish', resolve)
        stream.on('error', reject)

        doc.pipe(stream)
        doc.fontSize('20px')
        bugs.forEach((bug, idx) => {
            doc.text(`Title: ${bug.title}`, { paragraphGap: 15 })
            doc.text(`Severity: ${bug.severity}`, { paragraphGap: 15 })
            doc.text(`Description: ${bug.description}`, { paragraphGap: 15 })
            doc.text(`Bug ID: ${bug._id}`, { paragraphGap: 15 })
            if (idx < bugs.length - 1) doc.addPage()
        })

        doc.end()
    })
}