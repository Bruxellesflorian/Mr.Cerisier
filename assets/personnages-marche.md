# Marche : huit poses par direction

Création avec l’outil image_gen intégré, en reprenant le style de `personnages-doux.png`.

Fichiers utilisés : `personnages-marche-boy-v2.png` et `personnages-marche-girl-v2.png`. Chaque planche contient 32 poses (8 colonnes, 4 directions : face, gauche, droite, dos). Les images sans suffixe v2 sont les premières propositions, conservées mais non chargées par le jeu.

Les positions réelles des silhouettes sont enregistrées dans `personnages-marche-bounds.json`, pour éviter les découpes causées par les petits écarts de placement dans les planches générées. `personnages-marche-data.js` embarque les deux PNG et les coordonnées afin que la personnalisation fonctionne également en ouverture locale, sans serveur.

La pose au repos vient toujours de l’atlas précédent. Les couleurs du teint, des cheveux et de la veste restent personnalisables. Une échelle commune à chaque direction et une ligne de pieds commune stabilisent le rendu. Le cycle suit la distance parcourue et s’arrête contre les obstacles. Huit poses remplacent quatre, avec une cadence plus posée et des phases de flexion et de passage des jambes.

## Prompt final (appliqué à chaque première proposition)

Edit the attached character sheet. Preserve exactly this character design, face, clothes, colors, scale and minimalist rendering. Fix the WALK CYCLE to eight consecutive walking poses per row. EXACTLY 8 columns and 4 rows (32 sprites), uniform grid, canvas 2048x1024 aspect2:1, transparent background. No idle column, all eight columns belong to ONE seamless full gait cycle. Row1 front, row2 left profile, row3 right profile, row4 back. Columns1-4: LEFT foot contact, loading (slight knee bend), passing (RIGHT knee swings past planted LEFT leg), high point (RIGHT foot advancing). Columns5-8: RIGHT foot contact, loading, passing (LEFT knee swings past planted RIGHT leg), high point (LEFT foot advancing). Opposite arms swing. Supporting foot stays at a common baseline, hips travel slightly up/down while head remains stable. Small natural strides, relaxed walking, not running. Distinct legs, neither fused nor duplicated. Especially in side views, left and right legs and arm overlaps must switch visibly between first and second half of cycle. Keep feet/head alignment consistent, all bodies inside their cells, ample transparent margin. No shadows, no text, no grid lines, no floor. This is an animation correction, not an art redesign.

Vérifications : les 64 silhouettes sont présentes, les fonds comportent une transparence réelle et aucun membre ne dépasse du canevas de rendu après normalisation. Les fichiers originaux restent conservés.
