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

Les ressources sont `assets/gothic-map-texturee.png`, `assets/gothic-interiors.png` et les quatre atlas `assets/gothic-*.png`. Les leçons sont dans `content-gothic.js` avec leurs liens vers les ressources du BJCP. La progression existante est conservée.

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

Le budget est constitué des XP gagnés dans les examens moins le coût des équipements possédés. Le niveau et le total historique d’XP restent inchangés. Le premier aménagement complet coûte 680 XP : comptoir, tireuse, fût, entrée, toilettes, table de deux places, tonneau de deux places et Alex, le premier barman. Les tables existent en deux, quatre ou six places ; les tonneaux avec tabourets en deux ou quatre places.

Pour ouvrir, il faut au moins un équipement de chaque catégorie. Une tireuse doit être entièrement posée sur un comptoir. Déplacez ou revendez ses tireuses avant de déplacer, pivoter ou revendre le comptoir. Les anciennes tireuses posées au sol restent dans la sauvegarde et doivent être replacées sur un comptoir avant l’ouverture. Chaque tireuse doit se trouver à trois mètres maximum du centre d’un fût, et les équipements doivent rester accessibles depuis l’entrée. Les tireuses sont reliées au fût le plus proche par un trait indiquant la distance. L’entrée se place sur un bord de la pièce. Les toilettes sont un module avec murs et porte : la case signalée par la flèche doit rester accessible. La rotation déplace aussi cette porte. Une seule entrée et un seul barman sont disponibles dans ce prototype.

Ouvrir le bar ferme l’éditeur et lance une pièce jouable construite à partir des placements enregistrés. Le sol est un parquet dessiné avec une texture discrète. Les onze équipements possèdent chacun une image PNG transparente, visible dans le catalogue, sur le plan et dans la visite. Le joystick et le clavier permettent de se promener avec une caméra qui suit le personnage et des collisions contre les meubles et les murs des toilettes. Jusqu’à douze clients entrent. Une file se forme sur le chemin du comptoir : chacun attend son tour et une place libre avant de commander. Les clients assis sont dessinés au-dessus des chaises, jambes pliées et tournés vers la table, y compris après rotation du mobilier. Ils lèvent leur chope pour boire et restent assis pendant une durée tirée au hasard entre 0 et 15 secondes, puis utilisent parfois les toilettes et repartent. Le compteur affiche aussi les clients en attente. Le geste répété est désactivé si le système demande de réduire les animations. Les ventes sont comptabilisées, sans revenu supplémentaire en XP ni gestion des stocks pour le moment. Le bouton Aménager, la porte ou Échap ramènent à l’éditeur. Un menu ouvert ou la page en arrière-plan met la simulation en pause. Revenir à l’éditeur ferme le service ; les clients seront recréés à la prochaine ouverture. Cela interrompt la simulation ; les achats et les ventes déjà enregistrées sont conservés. Il n’y a pas de progression hors ligne.

Code : `bar-builder.js`, `bar-world.js`, `bar-assets.js`. Ressources : `assets/bar-items/`. Vérifications : `node --test bar-builder.test.cjs portraits.test.cjs` (achats, déplacement, revente, sauvegarde, distance des tireuses, accès et service des clients).

- `index.html` : interface en français au format portrait.
- `style.css` : présentation ordinateur et mise en page adaptable.
- `game.js` : rendu 2D en pixel art au style rétro 32 bits, mouvements, collisions, personnage, quiz et sauvegarde.
- `content.js` : bibliothèque, bars, questions et collection.

Le prototype est une application web locale destinée à être lancée sur ordinateur. La logique et le contenu sont séparés du rendu. Les commandes par pointeur et la mise en page portrait préparent une future adaptation mobile. Il n'y a pas encore de paquet Android/iOS, de synchronisation entre appareils, de compte ou de publication en ligne.

Les deux quartiers nocturnes utilisent désormais des décors avec textures mates légères et ombres douces : `assets/place-lanternes-texturee.png` et `assets/gothic-map-texturee.png`. Les originaux sont conservés ; voir `assets/textures-nocturnes.md`.

### Murs, poteaux et tableaux

Le pourtour de la salle est habillé de bois. Le catalogue propose aussi des segments de mur (30 XP) et des poteaux (40 XP) de 1 × 1 case. Ils bloquent les déplacements : gardez les accès au comptoir, aux sièges et à la porte des toilettes dégagés.

Dans le carrousel, **Tableaux** ouvre une liste verticale de dix créations originales de marques de bière fictives (25 XP chacune) : Cerisier, Brume du Verger, Pavés Dorés, Ambrée des Amis, Houblon Vagabond, Nuit de Velours, Rousse du Coin, Triple Rencontre, Saison des Fleurs et Zéro Détour. Choisissez un tableau puis touchez une case du mur extérieur, un mur installé ou un poteau. Un tableau ne peut être posé sur le sol ou un autre meuble, ni superposé à un autre tableau. Décrochez-le avant de déplacer ou de revendre son support.

Les tableaux sont affichés au-dessus de leur support dans l’éditeur et dans la visite ; ils sont plus petits sur les poteaux. Tous ces achats suivent la sauvegarde et le remboursement en XP habituels.

### Station murale et raccordement des fûts

La station de tirage à une voie coûte 80 XP et se fixe uniquement sur un mur (extérieur ou segment installé), jamais au sol ou sur un poteau. Son image est `assets/bar-items/station.png`.

Pour relier un fût : touchez le fût, choisissez **Raccorder**, puis touchez une station. Le fût et sa station doivent être collés par un côté : les diagonales et les cases séparées ne sont pas acceptées. Le tuyau apparaît dans l’éditeur et dans la visite. **Débrancher** retire le lien. Les raccordements sont sauvegardés avec le plan. Séparer un fût de sa station rend le lien invalide et le tuyau rouge ; l’ouverture reste bloquée jusqu’à correction. Revendre une station débranche les fûts qui y étaient reliés.

Tous les fûts doivent être raccordés avant l’ouverture. La règle existante des tireuses sur comptoir, à trois mètres maximum d’un fût, s’applique aussi. Les anciennes sauvegardes conservent leurs fûts ; il faut acheter une station et les raccorder avant de rouvrir. Le premier aménagement complet coûte désormais 620 XP.

### Bières débloquées et tireuses

Chaque bar réussi débloque son type de fût (le thème du bar : pils, blanche, IPA, etc.). Ces déblocages sont calculés depuis la progression existante : les bars déjà réussis comptent aussi, sans rejouer les examens. Il s’agit des types disponibles pour les fûts achetés dans l’éditeur.

Touchez une tireuse dans le plan : son panneau permet de choisir une bière parmi les types débloqués, pour chaque fût raccordé à une station et situé à 3 m maximum. Le fût conserve son type et la tireuse conserve le fût qu’elle dessert. Plusieurs tireuses reliées au même fût servent la même bière. Le choix est sauvegardé. Les fûts anciens sans type reçoivent la première bière débloquée ; les choix déjà enregistrés sont conservés.

Un type encore verrouillé ou un raccordement de tireuse devenu invalide bloque l’ouverture. En visite, le nom du type servi apparaît dans une petite étiquette sous la tireuse la plus proche, à courte distance. Les clients reçoivent une des bières proposées par les tireuses actives.

### Mini-jeu de service — 90 secondes

À l’ouverture, une caméra remonte depuis l’entrée jusqu’au comptoir en 1,8 seconde. Le personnage arrive près du bar à la fin de cette présentation. La préférence de réduction des animations supprime ce mouvement. Alex utilise désormais le même dessin animé que les clients ; le tirage ajoute un mouvement du bras au personnage qui utilise la pompe.

Le bouton **Lancer le mini-jeu · 1 min 30** démarre un service manuel. Le chronomètre vert est encadré de blanc, avec des chiffres également entourés de blanc. Une bulle indique la commande de chaque client : seuls les types réellement proposés aux tireuses sont demandés. Approchez-vous d’une tireuse et touchez le nom de la bonne bière ; après 1,2 seconde de tirage, portez le verre au premier client de la file et choisissez **Servir le client**. Une mauvaise bière n’est pas livrée. Les clients servis repartent avec leur verre.

La satisfaction dépend du temps écoulé depuis l’arrivée : servir rapidement rapporte davantage de dollars (de 3 à 10 par client). Après 30 secondes sans service, un client repart mécontent. La moyenne du service inclut les clients non servis. À 90 secondes, le service se termine, les commandes restantes comptent comme non servies, et le bilan affiche recettes, clients servis et satisfaction. Les dollars déjà gagnés sont sauvegardés dans le bar, indépendamment des XP. Une nouvelle partie ne réattribue pas les gains précédents.

Le **Stock de fûts** coûte 60 XP, occupe une case et doit être accessible : il est obligatoire pour ouvrir. Pendant le mini-jeu, chaque fût contient huit portions. Chaque verre tiré consomme une portion, même s’il est ensuite vidé. Quand le fût est vide, rejoignez le stock, choisissez **Prendre un fût neuf**, allez près du fût vide puis **Changer le fût vide** (1,8 seconde). On ne peut porter qu’un verre ou un fût neuf à la fois. Pour ce premier prototype, le stock fournit des remplacements sans limite ni coût supplémentaire. Les niveaux des fûts sont conservés entre les parties.

Un menu ouvert ou une page mise en arrière-plan met le service en pause. Revenir à l’éditeur l’interrompt ; les dollars et portions déjà enregistrés restent conservés. Hors mini-jeu, les clients autonomes restent une animation de visite et ne consomment pas les portions du service manuel.

Contrôleur : `bar-service.js`. Tests : `node --test bar-service.test.cjs bar-builder.test.cjs portraits.test.cjs`.
