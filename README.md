# La rue du Houblon — prototype 0.3

## Entrer et explorer

Les cinq bâtiments ont des architectures différentes : bibliothèque gothique, pub à colombages, brasserie industrielle, serre botanique et bar Art déco. Les cheminées émettent de la fumée et des braises animées. À l’intérieur, les feux scintillent avec une lueur mouvante.

Devant une porte, appuyer sur **E** ou **A à l’écran** pour entrer. On peut alors marcher dans une pièce. À la bibliothèque, rejoindre le grand livre au centre et appuyer sur E ; dans un bar, rejoindre le comptoir et appuyer sur E pour parler au patron et lancer le questionnaire. Les bars suivants restent verrouillés jusqu’à la réussite du précédent.

Pour sortir, rejoindre le repère **Sortie** au bas de la pièce puis appuyer sur E, utiliser le bouton **Sortir**, l’onglet **La rue**, ou Échap lorsque aucune fenêtre n’est ouverte. Fermer un questionnaire ramène dans la pièce. La position extérieure reste enregistrée : après rechargement, le personnage reprend devant le bâtiment. Le personnage et les XP existants sont conservés.

Les nouveaux décors se trouvent dans `assets/rue-identites.png` et `assets/interieurs-atlas.png`. `interiors.js` gère les pièces et `atmosphere.js` les effets animés. Les prompts de génération sont documentés dans `assets/direction-artistique-v3.md`.

## Direction artistique nocturne

La rue utilise maintenant un décor en pixel art détaillé inspiré des références fournies : bois sombre, briques, lanternes ambrées, végétation, enseignes néon et reflets sur les pavés. L’interface adopte les mêmes tons de cuivre et de nuit.

La caméra suit le personnage horizontalement et verticalement. Suivez la rue centrale et les cinq passages latéraux pour rejoindre les portes. Les collisions suivent les pavés du nouveau décor. Les sauvegardes de la première version conservent le personnage et les XP ; seule la position est replacée à l’entrée du quartier.

Le décor est enregistré dans `assets/rue-nocturne.png`, sa géométrie dans `street-art.js`, et le thème dans `night.css`. Le dossier `assets` doit rester à côté de `index.html`. Les instructions de génération figurent dans `assets/direction-artistique.md`.

Double-cliquer sur **Lancer le jeu.cmd** ou ouvrir **index.html** dans un navigateur récent (Edge, Chrome ou Firefox). Aucun serveur, compte ou installation n'est nécessaire. La police Google est facultative : le jeu fonctionne également sans réseau.

## Jouer

- Créer un personnage garçon ou fille, choisir son prénom, son teint, ses cheveux et son vêtement.
- Marcher avec les flèches, ZQSD, WASD ou les commandes à l'écran.
- S'approcher d'une porte puis appuyer sur E, sur le bouton A à l'écran ou sur le bouton d'entrée.
- La bibliothèque se trouve à gauche, au début de la rue. Les quatre bars se trouvent plus bas, en alternance à droite et à gauche.
- Lire les quatre chapitres, puis réussir au moins 3 questions sur 4 dans chaque bar.
- Chaque première réussite attribue des XP et débloque le bar suivant. Un niveau correspond à 100 XP. Rejouer un bar ne redonne pas de points.
- Consulter le carnet pour la progression, la collection pour les dix bières fictives et le portrait pour modifier le personnage.
- Les achats sont prévus pour une prochaine version. Les prix affichés sont indicatifs, les XP ne sont pas dépensés.

La progression est enregistrée dans le stockage local du navigateur. Utiliser le même navigateur et conserver les fichiers à la même adresse pour la retrouver. Le bouton « Recommencer l'aventure » du carnet permet de l'effacer après confirmation. Certains modes privés ou réglages du navigateur peuvent empêcher la sauvegarde.

## Contenu pédagogique

Le dossier était vide lors de la création du prototype. Les quatre fiches et les seize questions sont donc un contenu de démonstration, et non les documents précédemment préparés avec Mr Cerisier. Ils sont regroupés dans **content.js** pour faciliter leur remplacement par le cours réel. Les dix bières sont des créations fictives pour le jeu.

## Structure et évolution

- `index.html` : interface en français au format portrait.
- `style.css` : présentation ordinateur et mise en page adaptable.
- `game.js` : rendu 2D en pixel art au style rétro 32 bits, mouvements, collisions, personnage, quiz et sauvegarde.
- `content.js` : bibliothèque, bars, questions et collection.

Le prototype est une application web locale destinée à être lancée sur ordinateur. La logique et le contenu sont séparés du rendu. Les commandes par pointeur et la mise en page portrait préparent une future adaptation mobile. Il n'y a pas encore de paquet Android/iOS, de synchronisation entre appareils, de compte ou de publication en ligne.
