"use strict";


function validate() {
    return true;
}


async function merge(files) {
    const result = await PDFLib.PDFDocument.create();

    for (const file of files) {
        const url = URL.createObjectURL(file);
        let f = await fetch(url).then(r => r.arrayBuffer());
        const donorPdfDoc = await PDFLib.PDFDocument.load(f);

        const docLength = donorPdfDoc.getPageCount();
        for(var k = 0; k < docLength; k++) {
            // extract the page to copy
            const [donorPage] = await result.copyPages(donorPdfDoc, [k]);

            // add the page to the overall merged document
            result.addPage(donorPage);
        }
    }

    const pdfBytes = await result.save();
    var blob = new Blob([pdfBytes], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "merged.pdf";
    link.click();
}

function mergeSubmit() {
    const isValid = validate();
    document.getElementById('form-validity').innerHTML = isValid ? "" : "Fehler gefunden";
    if (isValid) {
        const selectedFiles = document.getElementById("pdf").files;
        merge(selectedFiles);
    }
    return false;
}

function dropHandler(ev) {
    ev.preventDefault();
    if (!ev.dataTransfer.items) { return; }
    var files = [];
    for (const item of ev.dataTransfer.items) {
        files.push(item.getAsFile());
    }
    merge(files);
}

function init() {
    document.getElementById("submit").addEventListener("click", mergeSubmit);
    let dropzone = document.getElementsByTagName("html")[0];
    dropzone.addEventListener("drop", dropHandler);
    dropzone.addEventListener("dragover", (ev) => {
        ev.preventDefault();
    });
    dropzone.addEventListener("dragend", (ev) => {
        ev.preventDefault();
    });
    
}

window.onload = init;
