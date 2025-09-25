"use strict";


function validate() {
    return true;
}


async function convert(file) {
    const url = URL.createObjectURL(file);
    let f = await fetch(url).then(r => r.blob());

    if (await HeicTo.isHeic(f)) {
        const jpeg = await HeicTo({
            blob: file,
            type: "image/jpeg",
            quality: 0.75
        })
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(jpeg);
        link.download = "converted.jpg";
        link.click();
    }
}

function heicSubmit() {
    const isValid = validate();
    document.getElementById('form-validity').innerHTML = isValid ? "" : "Fehler gefunden";
    if (isValid) {
        const selectedFiles = document.getElementById("heic").files;
        for (const file of selectedFiles) {
            convert(file);
        }
    }
    return false;
}

function dropHandler(ev) {
    ev.preventDefault();
    [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
            convert(item.getAsFile());
        }
    });
}

function init() {
    document.getElementById("submit").addEventListener("click", heicSubmit);
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
