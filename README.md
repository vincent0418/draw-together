# Read Me
## Installation
Décompresser le fichier ZIP du projet ou exécuter la commande
```git clone https://gitlab.com/tsv_epsi/draw-together``` (Requiert [Git](https://git-scm.com/downloads))

## Démarrer le serveur
Un serveur est nécessaire pour mettre en communication les clients. Une fois mis en relation aucune données ne passent par ce serveur (ce dernier peut être éteint une fois la connexion initiée).
Nous utilisons PeerServer, qui est un projet open source, en tant que serveur. [PeerServer](https://github.com/peers/peerjs-server)

**ATTENTION** deux clients ne pourront rentrer en contact uniquement s'ils se trouvent sur le même réseau que le serveur.

1. Install the package globally:
    ```shell script
    npm install peer -g
    ```
    
1. Run the server:
    ```shell script
    peerjs --port 9000 --key peerjs --path /draw-together
    ```

## Utilisation
1. Ouvrez le fichier `index.html` avec votre navigateur préféré.
1. Demandez à votre partenaire de vous donner son id de connexion et placez-le 
dans le champ dédié puis cliquez sur connexion. Ou donnez votre id de connexion à votre partenaire.
1. Pour changer la couleur, faites bouger les curseurs `Rouge`, `Vert` et `Bleu` ou sélectionnez
une couleur prédéfinie.
1. Pour augmenter ou diminuer la taille du pinceau, faites bouger le curseur `Rayon`.
1. Pour dessiner, cliquez sur le rectangle de dessin. Le dessin s'affiche en direct chez votre partenaire.
Il peut compléter votre dessin en direct.
1. Pour effacer le dessin, appuyez sur le bouton `Effacer` en bas de l'écran. 
ATTENTION : le dessin est effacé pour les deux utilisateurs
1. Pour vous déconnecter, appuyez sur `Déconnexion`. Votre partenaire pourra continuer à dessiner.
