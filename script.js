"use strict";

function isLetter(char) {
  return char.match(/[a-z]/i);
}

function mod(left, right)
{
    var next = left;
    while (next.length > 5)
    {
        var current = parseInt(next.substring(0, 9)) % 97;
        next = current.toString() + next.substring(9);
    }
    return parseInt(next) % 97;
}

function validateIBAN(iban){
    var stripped = iban.replace(/\s+/g, '');
    if (stripped.substring(0,2).toUpperCase() == "DE" && stripped.length != 22)
    {
        return false;
    }
    var rearranged = stripped.substring(4) + stripped.substring(0,4);
    var replaced = "";
    for (const c of rearranged) {
        var n = c;
        if (isLetter(c))
        {
            n = (c.toUpperCase().charCodeAt(0) - 55).toString();
        }
        replaced += n;
    }
    var remainder = mod(replaced, 97);
    // console.log(stripped);
    // console.log(rearranged);
    // console.log(replaced);
    // console.log(remainder);
    return remainder == 1;
}

function store(el){
    localStorage.setItem(el.id, el.value);
}

function load(el){
    return localStorage.getItem(el.id);
}

function validate(){
    var iban = document.getElementById('iban');
    var valid = validateIBAN(iban.value);
    showIBANState(valid);
    if (!valid) return false;
    var errorFound = false;
    var inputs = document.querySelectorAll('input.regular');
    for (const el of inputs) {
        if (!el.value)
        {
            el.style.borderColor = "red";
            errorFound = true;
        }
        else
        {
            el.style.borderColor = "";
        }
    }
    var lastFilled = 0;
    for (var i = 0; i < 8; ++i)
    {
        if (document.getElementById('desc' + i).value || document.getElementById('money' + i).value)
        {
            lastFilled = i;
        }
    }
    for (var i = 0; i < 8; ++i)
    {
        var name = document.getElementById('desc' + i);
        if (!name.value && i <= lastFilled)
        {
            name.style.borderColor = "red";
            errorFound = true;
        }
        else
        {
            name.style.borderColor = "";
        }
        var money = document.getElementById('money' + i);
        if (!money.value && i <= lastFilled)
        {
            money.style.borderColor = "red";
            errorFound = true;
        }
        else
        {
            money.style.borderColor = "";
        }
        var date = document.getElementById('date' + i);
        if (i <= lastFilled && !dateUseful(date.value))
        {
            date.style.borderColor = "red";
            errorFound = true;
        }
        else
        {
            date.style.borderColor = "";
        }
    }
    return !errorFound;
}

function dateUseful(value)
{
    if (!value) return false;
    const today = new Date();
    var daysInPast = (today - new Date(value))/ (1000 * 3600 * 24)
    return daysInPast > -100 && daysInPast < 2000;
}

function addStorageWriters(){
    var inputs = document.getElementsByTagName('input');
    for (const el of inputs) {
        if (el.type == "submit") continue;
        el.value = load(el);
        el.addEventListener("input", function (e) {
            store(el);
        });
    }
}

function showIBANState(state)
{
    var validity = document.getElementById("validity");
    validity.innerHTML = state ? "gültig" : "ungültig";
    validity.style.color = state ? "green" : "red";
}

function formatDate(date)
{
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}.${month}.${year}`;
    return currentDate;
}

function addCanvasStuff() {
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    })();

    var canvas = document.getElementById("signature");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0000b9";
    ctx.lineWidth = 2;


    var drawing = false;
    var mousePos = {
        x: 0,
        y: 0
    };
    var lastPos = mousePos;

    canvas.addEventListener("mousedown", function(e) {
        if (e.which != 1) return;
        drawing = true;
        lastPos = getMousePos(canvas, e);
    }, false);

    canvas.addEventListener("mouseup", function(e) {
        drawing = false;
    }, false);

    canvas.addEventListener("mousemove", function(e) {
        if (e.which != 1) drawing = false;
        mousePos = getMousePos(canvas, e);
    }, false);

    canvas.addEventListener("touchmove", function(e) {
        var touch = e.touches[0];
        var me = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(me);
    }, false);

    canvas.addEventListener("touchstart", function(e) {
        var touch = e.touches[0];
        mousePos = getMousePos(canvas, touch);
        var me = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(me);
    }, false);

    canvas.addEventListener("touchend", function(e) {
        var me = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(me);
    }, false);

    function getMousePos(canvas, mouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        }
    }

    function renderCanvas() {
        if (drawing) {
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

    var clear = document.getElementById("clear");
    clear.addEventListener("click", function(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    }, false);

}

function formatMoney(value)
{
    return Number(value).toFixed(2).toString().replace(".", ",");
}

function updateTotal()
{
    var money = document.getElementsByClassName('money');
    var total = 0;
    for (const el of money) {
        if (!el.value) continue;
        var val = el.value.replace(",", ".");
        total += Number(val);
    }
    document.getElementById("total").innerHTML = formatMoney(total);
    return formatMoney(total);
}

function get(id)
{
    return document.getElementById(id).value;
}

function formatIBAN(iban)
{
    var stripped = iban.replace(/\s+/g, '');
    var result = "";
    for (var i = 0; i < iban.length; i += 4)
    {
        result += stripped.substring(i,i+4) + " ";
    }
    return result;
}

function writeData(page, image)
{

 // 'width x height = 595 x 842 pt'.

    page.setFontSize(14);
    page.moveTo(57, 842-136);
    page.drawText(get('lname') + ", " + get('fname'));
    page.moveTo(57, 842-173);
    page.drawText(get('email'));
    page.moveTo(53, 842-211);
    page.setFontSize(16.7);
    page.drawText(formatIBAN(get('iban')));
    page.setFontSize(14);


    page.moveTo(298, 842-136);
    page.drawText(get('address'));
    page.moveTo(298, 842-173);
    page.drawText(get('plz') + " " + get('city'));


    for (var i = 0; i < 8; ++i)
    {
        if (!get('desc' + i)) break;
        page.moveTo(57, 842-260-34.7*i);
        page.drawText(formatDate(new Date(get('date' + i))));
        page.moveTo(156, 842-260-34.7*i);
        page.drawText(get('desc' + i));
        page.moveTo(455, 842-260-34.7*i);
        page.drawText(formatMoney(get('money' + i)));
    }

    page.moveTo(57, 842-559);
    page.setFontSize(10);
    page.drawText(get('city-sign') + ', ' + formatDate(new Date()));
    page.setFontSize(14);
    page.moveTo(156, 842-559);
    page.drawImage(image, {
        x: 156,
        y: 842-559,
        width: image.width / 3,
        height: image.height / 3,
    });

    page.moveTo(455, 842-559);
    page.drawText(updateTotal());
}



async function pdfCreate()
{
    const existingPDF = await fetch("https://simonkrogmann.github.io/antrag.b64").then(res => res.text());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPDF);
    const pages = pdfDoc.getPages();
    const page = pages[0];

    const url = document.getElementById('signature').toDataURL("image/png");
    const bytes = await fetch(url).then((res) => res.arrayBuffer())
    const image = await pdfDoc.embedPng(bytes);

    writeData(page, image);
    const pdfBytes = await pdfDoc.save();
    var blob = new Blob([pdfBytes], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "Antrag-Auslagenerstattung.pdf";
    link.click();
}

function antragSubmit()
{
    const isValid = validate();
    console.log(isValid);
    document.getElementById('form-validity').innerHTML = isValid ? "" : "Fehler gefunden";
    if (isValid)
    {
        pdfCreate();
    }
    return false;
}

function init(){
    document.getElementById("submit").addEventListener("click", antragSubmit);
    var iban = document.getElementById('iban');
    iban.addEventListener("input", function (e) {
        var valid = validateIBAN(iban.value);
        showIBANState(valid);
    });
    var money = document.getElementsByClassName('money');
    for (const el of money) {
        el.addEventListener("input", updateTotal);
    }
    addStorageWriters();
    document.getElementById("date").innerHTML = formatDate(new Date());

    addCanvasStuff();
    updateTotal();
}

window.onload = init;
