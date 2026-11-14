# Mobilier de l’atelier

Onze PNG générés avec imagegen, chacun avec un canal alpha transparent : comptoir, tireuse, fût, entrée, toilettes, tables avec deux/quatre/six chaises, tonneaux avec deux/quatre tabourets et Alex le barman.

Direction demandée : illustration minimaliste chaleureuse, formes arrondies lisibles, chêne, vert sauge et laiton, texture peinte discrète, ombres douces, vue légèrement surélevée avec face avant vers le sud. Aucun décor de pièce dans les sprites. Les toilettes constituent un module avec murs et porte sur le côté sud ; la rotation du plan tourne ce point d’accès vers l’ouest.

`bounds.js` contient les limites des pixels visibles relevées dans les PNG. `bar-assets.js` recadre uniquement leur affichage et conserve les fichiers originaux. Le même équipement est affiché dans le catalogue, sur la grille et dans la salle jouable. Le parquet est dessiné et mis en cache dans `bar-world.js`.

## Décoration

Douze ressources supplémentaires : `wall.png`, `post.png`, `poster0.png` à `poster9.png`. Les dix tableaux représentent des marques entièrement fictives, avec des emblèmes et palettes distincts. Les murs et poteaux occupent une case ; les tableaux se superposent à leur support sans étendre son emprise. Le pourtour en bois est dessiné par `bar-assets.js`.

`station.png` est la version murale à une voie du panneau de tirage, vue de face, sans plaque métallique arrière et sur fond transparent. Le raccord au fût est conservé par son `stationId` ; les tuyaux sont dessinés par le jeu.

`stock.png` représente une réserve de fûts sur une étagère de chêne et vert sauge, avec fond transparent. Le barman posé dans le plan et la visite est maintenant dessiné par `characters.js`, avec le même aspect que les clients ; son ancien PNG est conservé.
