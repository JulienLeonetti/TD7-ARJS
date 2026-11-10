# TD7 — AR.js

- `index.html` : partie 3, reconnaissance de l'affiche par Image Tracking NFT.
- `gps.html` : copie intégrale de l'ancienne application GPS (partie 1).
- `assets/a.fset`, `assets/a.fset3`, `assets/a.iset` : descripteurs fournis, conservés sans modification.
- `assets/paoli-corte.gif` : copie binaire du GIF original fourni (414 × 411, 9 images).
- `assets/fichier.glb` : modèle de l’étape précédente, conservé.

Ouvrir https://julienleonetti.github.io/TD7-ARJS/ dans Safari sur iPhone,
autoriser la caméra puis cadrer l'affiche ayant servi à générer les descripteurs.
Le chargement disparaît lorsque le suivi NFT et le GIF sont prêts.
Le GIF s'affiche sur un plan uniquement lorsque l'affiche est reconnue.
Les 9 images sont décodées dans le navigateur et affichées dans une CanvasTexture Three.js :
360 ms par image, boucle de 3,24 s, sans conversion vidéo.
`js/animated-gif.js` utilise le décodeur [omggif 1.0.10](https://github.com/deanm/omggif),
dont la licence MIT est conservée dans `vendor/omggif-1.0.10.js`.

`aframe-gif-shader` 0.9.1 n'est pas utilisé : son [package](https://github.com/mayognaise/aframe-gif-shader/blob/master/package.json)
cible A-Frame 0.9 et son [code](https://github.com/mayognaise/aframe-gif-shader/blob/master/index.js)
appelle `THREE.Math.floorPowerOfTwo`, absent de Three.js r164 fourni par A-Frame 1.6.
La CanvasTexture utilise directement `AFRAME.THREE` et un canvas 2D, sans API vidéo ni ImageDecoder.

Les bibliothèques sont figées sur A-Frame 1.6.0 et AR.js 3.4.8.
La copie locale d'AR.js dans `vendor/` corrige le démarrage du moteur NFT,
les chemins relatifs depuis GitHub Pages, le cadrage à partir des dimensions vidéo
réelles et la limite de distance d'affichage (unités NFT en millimètres). Le fonctionnement NFT reste identique.
La conformité exacte aux pages 9 à 11 reste à comparer au PDF du TD, non fourni dans le dossier.
Le test sur Safari sur iPhone et l'affiche physique reste nécessaire pour valider
l'animation, le suivi, l'échelle et l'orientation. Aucun test sur iPhone réel n'est revendiqué.

## Modèle 3D

[MENS](https://sketchfab.com/3d-models/mens-a400147bb3cb4bd0b36b8ed245d0b5b5),
par [kwong.x](https://sketchfab.com/kwong.x),
sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Le fichier GLB est inchangé.
