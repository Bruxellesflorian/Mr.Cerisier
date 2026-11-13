# Personnages 0.4

Sprites créés avec l’outil intégré image_gen. Atlas final : `personnages-atlas.png`, 8 colonnes × 4 lignes. `personnages-data.js` contient le même PNG en URI de données pour permettre la personnalisation Canvas en ouvrant le jeu depuis un fichier local.

Colonnes 1–4 : garçon ; 5–8 : fille. Lignes : face, gauche, droite, dos. Chaque groupe de quatre colonnes contient les poses de marche. Le moteur normalise les silhouettes et ancre les pieds, puis applique les palettes au teint, aux cheveux et à la veste.

Tailles : 44 unités dans la rue, 68 à l’intérieur, 58 au comptoir, 160 dans l’atelier. Les collisions restent ancrées aux pieds. Six couleurs sont disponibles pour chaque catégorie ; les choix précédents et les XP sont conservés.

## Prompt de création

Create a production 2D RPG CHARACTER SPRITE SHEET on genuinely TRANSPARENT background. EXACT grid: 8 columns and 4 rows, 32 equal SQUARE cells, landscape aspect 2:1, preferably 2048x1024. NO grid lines, labels, text or shadow painted outside feet. Each cell contains ONE whole full-body character, centered at same scale, feet at 90% cell height, head at 10%, width at most 58% cell. Each sprite is detailed premium 32-bit pixel art, realistic adult RPG proportions about 4 heads tall, readable expressive face, detailed hair strands, cloth folds, brown leather boots, belt with brass buckle, small satchel. Rich warm amber rim light and deep purple shadows to match atmospheric dark fantasy tavern environments, NOT chibi, NOT flat geometric art, NOT vector.
COLUMN PLAN: columns 1-4 same adult male character with short hair. Columns 5-8 same adult female character with shoulder-length hair tied behind. Both fully clothed travelers wearing fitted BLUE/TEAL jackets over cream shirt, dark trousers and brown leather boots. Hair burgundy RED, natural peach skin. These separated color families are intentional for runtime recoloring. No blue in skin or leather, no red in clothes. No hats or weapons.
ROW PLAN top to bottom: row1 facing FRONT/south toward viewer. row2 facing LEFT/west exact profile. row3 facing RIGHT/east exact profile. row4 facing BACK/north away from viewer, back of head visible and NO FACE.
For EACH group of 4 columns in each row, draw a true four-frame looping walk cycle: left foot forward, neutral passing pose, right foot forward, neutral opposite passing pose, with alternating arm swing. Keep identical body identity, clothes, head size, lighting and baseline across frames. Leave clear transparent margin between ALL sprites. Strict grid 8 by 4. Transparent background, no floor, no backdrop, no cast shadow.

## Retouche de transparence

Remove ALL the pale background from this sprite atlas, including between arms and bodies and between legs. Output genuinely transparent alpha=0 empty background. Preserve all 32 characters EXACTLY with their grid, positions, colors, dimensions, frame poses and detail unchanged. This is a production sprite-sheet cutout for a game. No white, cream, checkerboard, gray haze, drop shadows or background pixels. Transparent around and between every sprite. Do not repaint or rearrange characters.
