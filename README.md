## Parcours par styles — découverte pour débutants

Chaque bar possède un thème exclusif et quatre QCM à trois propositions. Les 48 questions s’adressent aux débutants : couleur, origine, ingrédient et arômes familiers. La progression reste douce : premiers repères, nouvelles découvertes, puis quelques notions simples expliquées comme le corps ou la torréfaction. Aucun diagnostic de dégustateur n’est demandé. Trois réponses justes restent nécessaires ; les récompenses, niveaux et réussites déjà enregistrées sont conservés.

| Quartier | Thèmes dans l’ordre des bars |
|---|---|
| Brasseurs | Pils allemande ; blanche belge (witbier) ; American IPA ; American Amber Ale |
| Lanternes | Saison ; tripel belge ; lambic traditionnel ; Rauchbier |
| Brumes | British Brown Ale ; doppelbock ; barleywine anglais ; Irish Stout |

« Brune » et « blanche » sont précisés par un style pour éviter les généralisations. Les douze chapitres préparent les questions correspondantes. Chaque réponse reçoit une explication dédiée. `curriculum.txt` conserve la rédaction éditoriale ; les fichiers exécutés sont `content.js`, `content-night.js` et `content-gothic.js` et doivent rester synchronisés avec cette rédaction.

## Quartier des Brumes

Après les huit premiers bars, **Quartiers** donne accès au quartier gothique. Sa bibliothèque propose quatre nouveaux chapitres et seize questions. Les quatre établissements sont Le Corbeau d’Argent, La Crypte des Fermenteurs, Le Griffon Pourpre et L’Orangerie des Brumes.

Le décor conserve les formes simples et les couleurs mates du jeu. Quatre nouveaux intérieurs et quatre portraits gothiques (six poses chacun) accompagnent les examens. Des petits feux, halos lumineux et reflets animent les entrées ; les cheminées restent animées. Les effets respectent la préférence système de réduction des animations.

Les ressources sont `assets/gothic-map.png`, `assets/gothic-interiors.png` et les quatre atlas `assets/gothic-*.png`. Les leçons sont dans `content-gothic.js` avec leurs liens vers les ressources du BJCP. La progression existante est conservée.

# La rue du Houblon — prototype 0.6

## Deuxième quartier et niveaux

Après avoir réussi les quatre premiers bars, ouvrez **Quartiers** en haut du jeu pour rejoindre la **Place des Lanternes**, ou utilisez le passage au sud du village. Cette carte nocturne possède une place avec fontaine, un circuit périphérique, quatre nouveaux bars et un kiosque de lecture. Le retour au premier quartier reste libre.

Les thèmes de la deuxième ville sont désormais la saison, la tripel, le lambic et la Rauchbier : quatre leçons et seize questions. Les sources figurent dans les leçons et dans `assets/place-lanternes.md`. Les intérieurs de la place reprennent les pièces existantes avec un éclairage teinté et de nouveaux personnages.

Le badge près du portrait commence au **niveau 1**. Chaque bar réussi pour la première fois donne **exactement +1 niveau**, jusqu’au niveau 13 après les douze bars. Les XP restent une récompense distincte pour la future boutique. Rejouer un bar réussi ne redonne ni XP ni niveau. Les anciennes sauvegardes sont conservées et leur niveau est recalculé à partir des bars déjà réussis ; le quartier actuel est également enregistré.

## Commandes tactiles

Posez le pouce sur le décor : un joystick flottant apparaît exactement à cet endroit. Faites glisser le doigt : une petite inclinaison fait marcher doucement, une grande inclinaison atteint la vitesse maximale. Relâcher arrête le personnage et masque le joystick. Il disparaît aussi lorsqu’une fenêtre s’ouvre, que la scène change ou qu’un toucher est interrompu. Le panneau de commandes a été retiré et la zone de jeu occupe l’espace libéré. Les boutons d’interaction ne déclenchent pas le joystick.

Le bouton A est supprimé. Touchez directement la fenêtre contextuelle qui apparaît près d’une porte, du livre, d’un comptoir ou de la sortie. Les flèches du clavier, ZQSD/WASD et la touche E restent disponibles sur ordinateur.

## Direction minimaliste

Le jeu adopte la planche approuvée : village crème et sauge, cinq intérieurs assortis et personnages illustrés aux silhouettes arrondies. L’interface, les flammes et la fumée suivent cette direction. Les anciens décors sont conservés dans les assets. Les nouveaux fichiers et prompts sont décrits dans `assets/direction-minimaliste.md`.

La caméra est rapprochée de 35 % dans la rue et de 25 % dans les intérieurs. La vitesse passe de 95 à 140 unités par seconde (+47 %), avec une cadence de marche adaptée. Le cadrage réserve de la place au bouton d’interaction pour garder les pieds du personnage visibles. Ces paramètres sont regroupés dans `camera.js`.

## Atelier du personnage

Le portrait ouvre un atelier avec un grand aperçu animé. Deux flèches placées de chaque côté du personnage le font pivoter entre face, profils et dos dans les deux sens. L’atelier propose aussi une pause, six teints, six couleurs de cheveux et six couleurs de veste. « Proposer une palette » permet d’essayer une combinaison aléatoire. Enregistrer applique les choix ; fermer annule les modifications.

Les nouveaux sprites possèdent quatre poses de marche dans chacune des quatre directions. Ils mesurent 44 unités dans la rue et 68 dans les intérieurs, contre 26 auparavant. Les personnages des bars utilisent également les nouveaux sprites. `characters.js` gère leur affichage et leurs palettes ; les ressources et prompts sont décrits dans `assets/personnages-v4.md`. Les sauvegardes précédentes restent compatibles.

## Entrer et explorer

Les cinq bâtiments ont des architectures différentes : bibliothèque gothique, pub à colombages, brasserie industrielle, serre botanique et bar Art déco. Les cheminées émettent de la fumée et des braises animées. À l’intérieur, les feux scintillent avec une lueur mouvante.

Devant une porte, appuyer sur **E** ou toucher la fenêtre d’entrée pour entrer. On peut alors marcher dans une pièce. À la bibliothèque, rejoindre le grand livre au centre et appuyer sur E ; dans un bar, rejoindre le comptoir et appuyer sur E pour parler au patron et lancer le questionnaire. Les bars suivants restent verrouillés jusqu’à la réussite du précédent.

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
- Chaque première réussite attribue des XP et débloque le bar suivant. Chaque nouveau bar réussi donne un niveau, indépendamment des XP. Rejouer un bar ne redonne pas de points.
- Consulter le carnet pour la progression, la collection pour les dix bières fictives et le portrait pour modifier le personnage.
- Les achats sont prévus pour une prochaine version. Les prix affichés sont indicatifs, les XP ne sont pas dépensés.

La progression est enregistrée dans le stockage local du navigateur. Utiliser le même navigateur et conserver les fichiers à la même adresse pour la retrouver. Le bouton « Recommencer l'aventure » du carnet permet de l'effacer après confirmation. Certains modes privés ou réglages du navigateur peuvent empêcher la sauvegarde.

## Contenu pédagogique

Le parcours actuel contient douze fiches et quarante-huit questions originales sur les styles de bière, avec des références BJCP dans chaque chapitre. Il ne reprend pas un cours externe de Mr Cerisier. Les dix bières sont des créations fictives pour le jeu.

## Structure et évolution

### Atelier « Mon bar »

Le troisième bouton de la navigation ouvre une pièce vide de 15 × 12 cases (une case = un mètre). Le catalogue d’équipement est un carrousel horizontal placé au-dessus du plan. Les cases du plan sont agrandies, et celui-ci se fait défiler horizontalement en le faisant glisser sur téléphone tant qu’aucun élément n’est sélectionné. Choisir un équipement puis toucher le plan pour l’acheter et le placer. Toucher un élément posé permet de le déplacer, le pivoter puis confirmer sa position, ou le revendre au prix d’achat. Le plan et les achats sont enregistrés avec la progression. Au clavier, les flèches déplacent le curseur du plan et Entrée permet de placer/sélectionner.

Le budget est constitué des XP gagnés dans les examens moins le coût des équipements possédés. Le niveau et le total historique d’XP restent inchangés. Le premier aménagement complet coûte 540 XP : comptoir, tireuse, fût, entrée, toilettes, table de deux places, tonneau de deux places et Alex, le premier barman. Les tables existent en deux, quatre ou six places ; les tonneaux avec tabourets en deux ou quatre places.

Pour ouvrir, il faut au moins un équipement de chaque catégorie. Chaque tireuse doit se trouver à trois mètres maximum du centre d’un fût, et les équipements doivent rester accessibles depuis l’entrée. Les tireuses sont reliées au fût le plus proche par un trait indiquant la distance. L’entrée se place sur un bord de la pièce. Une seule entrée et un seul barman sont disponibles dans ce prototype.

Une fois ouvert, jusqu’à six clients entrent, commandent au comptoir, prennent une place disponible puis repartent. Les ventes sont comptabilisées, sans revenu supplémentaire en XP ni gestion des stocks pour le moment. Fermer le bar, quitter son menu ou mettre la page en arrière-plan interrompt la simulation ; les achats et les ventes déjà enregistrées sont conservés. Il n’y a pas de progression hors ligne.

Code : `bar-builder.js`. Vérifications : `node --test bar-builder.test.cjs portraits.test.cjs` (achats, déplacement, revente, sauvegarde, distance des tireuses, accès et service des clients).

- `index.html` : interface en français au format portrait.
- `style.css` : présentation ordinateur et mise en page adaptable.
- `game.js` : rendu 2D en pixel art au style rétro 32 bits, mouvements, collisions, personnage, quiz et sauvegarde.
- `content.js` : bibliothèque, bars, questions et collection.

Le prototype est une application web locale destinée à être lancée sur ordinateur. La logique et le contenu sont séparés du rendu. Les commandes par pointeur et la mise en page portrait préparent une future adaptation mobile. Il n'y a pas encore de paquet Android/iOS, de synchronisation entre appareils, de compte ou de publication en ligne.
