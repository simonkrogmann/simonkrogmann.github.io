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
    console.log("Yeah");
    var iban = document.getElementById('iban').value;
    console.log(validateIBAN(iban));

    return false;
}
function init(){
    document.getElementById('form').onsubmit = validate;
    var iban = document.getElementById('iban');
    iban.addEventListener("input", function (e) {
        var validity = document.getElementById("validity");
        var valid = validateIBAN(iban.value)
        validity.innerHTML = valid ? "gültig" : "ungültig";
        validity.style.color = valid ? "green" : "red";
    });

    var inputs = document.getElementsByTagName('input');
    for (const el of inputs) {
        if (el.type == "submit") continue;
        el.value = load(el);
        el.addEventListener("input", function (e) {
            store(el);
        });
    }
}
window.onload = init;
