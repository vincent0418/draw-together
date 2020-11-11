// Récupération du DOM
const canvas_draw = document.getElementById("canvas_draw");
const input_r = document.getElementById("input_r");
const input_g = document.getElementById("input_g");
const input_b = document.getElementById("input_b");
const input_radius = document.getElementById("input_radius");
const button_clear = document.getElementById("button_clear");
const span_r = document.getElementById("span_r");
const span_g = document.getElementById("span_g");
const span_b = document.getElementById("span_b");
const span_radius = document.getElementById("span_radius");
const canvas_brush = document.getElementById("canvas_brush");
const input_id_peer = document.getElementById("input_id_peer");
const peer_id_span = document.getElementById("peer_id_span");
const connecte = document.getElementById("connecte");
const connexion = document.getElementById("connexion");
const blueColor = document.getElementById("blueColor");
const greenColor = document.getElementById("greenColor");
const blackColor = document.getElementById("blackColor");
const whiteColor = document.getElementById("whiteColor");
const yellowColor = document.getElementById("yellowColor");
const purpleColor = document.getElementById("purpleColor");
const redColor = document.getElementById("redColor");
const orangeColor = document.getElementById("orangeColor");
const pinkColor = document.getElementById("pinkColor");
const errorDiv = document.getElementById("error");

//Initialisation des variables par défaut
let peer = new Peer(null,{
    host:  'localhost',
    port: 9000,
    path: '/draw-together'
});
let ctx = canvas_draw.getContext("2d");
let idPeer = null;
let conn = null;
let isDown = false;
let startX;
let startY;

//A l'ouverture génère un id de connexion.
peer.on('open', function (id) {
    idPeer = id;
    peer_id_span.innerHTML = id
});

//Si un partenaire se connecte initialise la connexion automatiquement
peer.on('connection', function (con) {
    conn = con;
    setConnect();
});

// S'il y a une erreur dans la connexion, fait apparaitre une popup avec l'erreur
peer.on('error', function (err) {
    errorDiv.classList.remove('hidden');
    errorDiv.innerHTML = err;
});

//Si le client clique sur le bouton connexion il se connecte au client avec l'id selectionné
function connect() {
    conn = peer.connect(input_id_peer.value);
    setConnect();
}

//Deconnecte le client et reinitialise l'interface
function disconnect() {
    peer.disconnect();
    connecte.classList.add('hidden');
    connexion.classList.remove('hidden');
}

function getMousePositionInCanvas(e,axe){
    if(axe === "X"){
        return Math.round(e.clientX - canvas_draw.getBoundingClientRect().left)
    }
    if (axe === "Y"){
        return Math.round(e.clientY - canvas_draw.getBoundingClientRect().top);
    }
}

//Envoie le dessin et initialise isDown a true pour que le partenaire puisse commencer à dessiner
function handleMouseDown(e) {
    conn.send(JSON.stringify(canvas_draw))
    e.preventDefault();
    startX = getMousePositionInCanvas(e,"X");
    startY = getMousePositionInCanvas(e,"Y");
    isDown = true;
}

//Arrete de dessiner si le client lache le clic
function handleMouseUp(e) {
    e.preventDefault();
    isDown = false;
}

//Arrête de dessiner si la souris quitte le canvas
function handleMouseOut(e) {
    e.preventDefault();
    mouseX = getMousePositionInCanvas(e,"X");
    mouseY = getMousePositionInCanvas(e,"Y");
    isDown = false;
}

//si le client clique en bougeant la souris, dessine la ligne dans la couleur selectionnee
//puis l'envoie au partenaire
function handleMouseMove(e) {
    if (!isDown) {
        return;
    }
    conn.send(canvas_draw.toDataURL())

    const r = Number(input_r.value);
    const g = Number(input_g.value);
    const b = Number(input_b.value);
    const color = rgbToHex(r, g, b);
    const radius = Number(input_radius.value);

    e.preventDefault();
    mouseX = getMousePositionInCanvas(e,"X");
    mouseY = getMousePositionInCanvas(e,"Y");

    ctx.beginPath();
    ctx.strokeStyle = color
    ctx.fillStyle = color;
    ctx.lineWidth = 2 * radius;
    ctx.lineCap = "round";
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    startX = mouseX;
    startY = mouseY;
}

// Convertit la couleur du RGB vers un code hexadécimal
function componentToHex(c) {
    const hex = Number(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//Efface le dessin et l'efface pour le partenaire
function clear() {
    const width = canvas_draw.clientWidth;
    const height = canvas_draw.clientHeight;
    const ctx = canvas_draw.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, width, height);
    ctx.stroke();
    conn.send("");
}

// Met à jour le DOM (RGB span, canvas_brush)
function updateDom() {
    // Récupère les valeurs RGB
    const r = input_r.value;
    const g = input_g.value;
    const b = input_b.value;
    const radius = input_radius.value;
    const color = rgbToHex(r, g, b);

    // met à jour les elements teste

    span_r.innerHTML = r;
    span_g.innerHTML = g;
    span_b.innerHTML = b;
    span_radius.innerHTML = radius;

    // Dessine le pinceau dans canvas_brush
    const ctx = canvas_brush.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, 100, 100);
    ctx.arc(50, 50, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

//Définit la couleur à partir des valeurs RGB
function colorButton(r, g, b) {
    input_r.value = r;
    input_g.value = g;
    input_b.value = b;
    updateDom();
}

/*fitToContainer(canvas_draw)
function fitToContainer(canvas){
    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}*/

//Initialisation des clicks des couleurs par défaut
redColor.onclick = function () {
    colorButton(255, 0, 0);
}
blueColor.onclick = function () {
    colorButton(0, 0, 255);
}
greenColor.onclick = function () {
    colorButton(0, 255, 0);
}
blackColor.onclick = function () {
    colorButton(0, 0, 0);
}
whiteColor.onclick = function () {
    colorButton(255, 255, 255);
}
yellowColor.onclick = function () {
    colorButton(255, 255, 0);
}
purpleColor.onclick = function () {
    colorButton(128, 0, 128);
}
pinkColor.onclick = function () {
    colorButton(255, 192, 203);
}
orangeColor.onclick = function () {
    colorButton(255, 165, 0);
}

//connecte le client et initialise l'interface de dessin
function setConnect() {
    connecte.classList.remove('hidden');
    connexion.classList.add('hidden');

    conn.on('open', function () {
        conn.on('data', function (data) {
            ctx = canvas_draw.getContext("2d");
            if (data === "") {
                ctx.clearRect(0, 0, canvas_draw.width, canvas_draw.height);
            }
            let img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
            img.src = data;
        });
    });
}

//Initialisation des events listener du DOM
canvas_draw.onmousedown = function (e) {
    handleMouseDown(e);
};
canvas_draw.onmousemove = function (e) {
    handleMouseMove(e);
};
canvas_draw.onmouseup = function (e) {
    handleMouseUp(e);
};
canvas_draw.onmouseout = function (e) {
    handleMouseOut(e);
};
input_r.oninput = updateDom;
input_g.oninput = updateDom;
input_b.oninput = updateDom;
input_radius.oninput = updateDom;
button_clear.onclick = clear

//Initialisation du dom
updateDom();
