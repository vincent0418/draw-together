const input_id_peer = document.getElementById("input_id_peer");
const peer_id_span = document.getElementById("peer_id_span");
const connecte = document.getElementById("connecte");
const connexion = document.getElementById("connexion");
const errorDiv = document.getElementById("error");

//Initialisation des variables par défaut
let peer = new Peer(null,{
    host:  'localhost',
    port: 9000,
    path: '/draw-together'
});
let ctx = canvas_draw.getContext("2d");
let conn = null;

//A l'ouverture génère un id de connexion.
peer.on('open', function (id) {
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