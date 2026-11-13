# Portraits des huit comptoirs

Créés avec l’outil image_gen intégré, à partir de la référence fournie par l’utilisateur : https://chatgpt.com/s/p_bece4f75f3b4819183e7428cb6369dcc

Les prompts exacts et les descriptions des personnages sont conservés dans `prompts.json`. Chaque PNG contient six portraits en grille de trois colonnes et deux lignes, lus directement par `portraits.js` via les positions CSS, sans découpe destructive des images.

| Fichier | Personnage | Bar |
| --- | --- | --- |
| gaston.png | Gaston, patron rond à moustache grise | Le Premier Malt |
| lou.png | Lou, brasseuse athlétique aux cheveux courts | La Cuve Dorée |
| iris.png | Iris, botaniste âgée à lunettes | Le Houblon Sauvage |
| alma.png | Alma, patronne aux tresses grises | Le Cercle des Brasseurs |
| nora.png | Nora, jeune horticultrice rousse | Le Jardin de Minuit |
| emile.png | Émile, brasseur au visage allongé | La Cuve Lunaire |
| sam.png | Sam, gardien de cave chauve à barbe grise | L’Escale des Étoiles |
| mila.png | Mila, sommelière au carré noir | L’Observatoire |

Les six poses sont : accueil, explication, présentation d’une bière, sourire, réflexion et félicitations. À chaque question, une pose différente de la dernière affichée est choisie. Les réponses correctes déclenchent un sourire, les erreurs une réflexion bienveillante ; le résultat utilise la pose de félicitations ou de réflexion.

L’interface utilise les variantes `*-transparent.png`, créées avec image_gen : seul le fond extérieur aux cadres dorés est transparent. Les originaux restent conservés. Le prompt de détourage est dans `transparency-prompt.txt`.

Pour le test sans cadres, `portraits.js` recadre uniquement l’affichage sur des rectangles de 340 × 350 pixels à l’intérieur des dorures (colonnes x = 104, 600, 1085 ; lignes y = 90, 585). Aucun fichier image n’est modifié. Les portraits sont affichés jusqu’à 192 pixels de large, avec un maximum de 60 % de la ligne pour laisser la place au nom sur les écrans étroits. Les six expressions utilisent le même cadrage.

Vérification du parcours : `node --test portraits.test.cjs` depuis la racine du projet. Les sprites de déplacement restent indépendants de ces portraits de dialogue.
