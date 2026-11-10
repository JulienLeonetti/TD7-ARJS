# TD7 — AR.js

- `index.html` : partie 3, reconnaissance de l'affiche par Image Tracking NFT.
- `gps.html` : copie intégrale de l'ancienne application GPS (partie 1).
- `assets/a.fset`, `assets/a.fset3`, `assets/a.iset` : descripteurs fournis, conservés sans modification.
- `assets/fichier.glb` : copie du modèle existant `assets/mens.glb`.

Ouvrir https://julienleonetti.github.io/TD7-ARJS/ dans Safari sur iPhone,
autoriser la caméra puis cadrer l'affiche ayant servi à générer les descripteurs.
Le chargement disparaît lorsque le suivi NFT et le modèle sont prêts.
Le personnage s'affiche uniquement lorsque l'affiche est reconnue.

Les bibliothèques sont figées sur A-Frame 1.6.0 et AR.js 3.4.8.
La copie locale d'AR.js dans `vendor/` corrige le démarrage du moteur NFT,
les chemins relatifs depuis GitHub Pages, le cadrage à partir des dimensions vidéo
réelles et la limite de distance d'affichage (unités NFT en millimètres). Le fonctionnement NFT reste identique.
La conformité exacte aux pages 9 à 11 reste à comparer au PDF du TD, non fourni dans le dossier.
Le test sur l'affiche physique reste nécessaire pour valider le suivi, l'échelle et l'orientation.

## Modèle 3D

[MENS](https://sketchfab.com/3d-models/mens-a400147bb3cb4bd0b36b8ed245d0b5b5),
par [kwong.x](https://sketchfab.com/kwong.x),
sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Le fichier GLB est inchangé.
