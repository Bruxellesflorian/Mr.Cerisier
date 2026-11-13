/* Chapter two: original educational summaries and questions. Sources linked per chapter. */
(() => {
 const c=window.HOUBLON_CONTENT;
 const lessons=[
  ['Le houblon autrement','Arômes et houblonnage à cru','Le houblon apporte des arômes en plus de son amertume. Un ajout pendant ou après la fermentation est appelé houblonnage à cru, ou dry hopping. Il met particulièrement en avant les arômes du houblon. Selon les variétés, on peut rencontrer des notes d’agrumes, de fleurs ou de résine. Un parfum intense ne signifie pas automatiquement une amertume plus forte.','Dry hopping : un ajout de houblon pendant ou après fermentation, destiné surtout aux arômes.','BJCP · Le houblon','https://www.bjcp.org/exam-certification/program/studying/beer-exam-study-guide/hops/'],
  ['D’où viennent les bulles ?','Fermentation et conditionnement','Les bulles proviennent du dioxyde de carbone, ou CO₂. La levure en produit lorsqu’elle fermente des sucres. Une refermentation en bouteille peut donc produire une carbonatation naturelle : de la levure et des sucres fermentescibles participent à cette étape. Le CO₂ peut aussi être apporté sous pression. Une bière refermentée peut présenter un dépôt de levure ; sa présence seule ne prouve pas une altération.','La fermentation produit du CO₂ ; la refermentation en bouteille est une façon de rendre la bière pétillante.','IFT · La fabrication de la bière','https://www.ift.org/food-technology-magazine/how-beer-is-processed'],
  ['Préserver les arômes','Lumière, chaleur et temps','La lumière peut altérer une bière. Les canettes la protègent de la lumière, tandis que le verre brun protège mieux que le verre clair ou vert. La chaleur accélère les réactions de vieillissement. L’oxydation peut donner des impressions de papier ou de carton mouillé. Un stockage frais, à l’abri de la lumière, aide à préserver les arômes.','Frais et à l’abri de la lumière : deux bons réflexes de conservation.','Cicerone · Défauts aromatiques','https://www.cicerone.org/us-en/node/9581'],
  ['Le verre fait la différence','Propreté et observation','Un verre adapté à la bière doit être propre et sans résidus gras. Des bulles collées aux parois peuvent signaler des impuretés. Un verre propre favorise une mousse régulière et une présentation soignée. Pour décrire ce que l’on observe, on distingue la robe et la mousse ; au nez, on parle d’arômes. Un verre propre aide à apprécier ces caractéristiques sans odeurs ou résidus parasites.','Un verre visuellement propre peut encore contenir des résidus gras.','WSET · Conserver et servir la bière','https://wsetglobal.com/news-insights/insight-opinion/how-to-store-and-serve-beer/']
 ];
 c.chapters.push(...lessons.map((l,i)=>({title:l[0],subtitle:l[1],text:l[2],takeaway:l[3],sourceTitle:l[4],sourceUrl:l[5],bar:i+4})));
 c.bars.push(
 {name:'Le Jardin de Minuit',theme:'Les arômes du houblon',reward:300,questions:[
  ['Le dry hopping désigne un ajout de houblon…',['Pendant ou après la fermentation','Uniquement dans le malt sec','Dans le verre du client'],0,'Il s’agit d’un houblonnage pendant ou après la fermentation.'],
  ['Le houblonnage à cru recherche surtout…',['Une couleur plus noire','Des arômes de houblon','La disparition du CO₂'],1,'Cette technique met surtout les arômes du houblon en valeur.'],
  ['Quelle famille aromatique peut venir du houblon ?',['Les agrumes','Le verre propre','Le métal du bouchon uniquement'],0,'Certaines variétés présentent des notes d’agrumes.'],
  ['Un parfum de houblon très intense signifie-t-il forcément plus d’amertume ?',['Toujours','Seulement en bouteille','Non'],2,'L’intensité aromatique et l’amertume sont deux perceptions distinctes.']]},
 {name:'La Cuve Lunaire',theme:'Les bulles et la refermentation',reward:350,questions:[
  ['Quel gaz forme les bulles de bière ?',['L’hélium','Le dioxyde de carbone','L’oxygène uniquement'],1,'La carbonatation est liée au CO₂.'],
  ['Lors d’une refermentation en bouteille, la levure utilise…',['Des sucres fermentescibles','Le verre','La lumière'],0,'La levure fermente les sucres et produit notamment du CO₂.'],
  ['La refermentation en bouteille peut produire…',['Du houblon','Du malt','Une carbonatation naturelle'],2,'Le CO₂ produit dans la bouteille contribue à rendre la bière pétillante.'],
  ['Un dépôt de levure prouve-t-il à lui seul que la bière est altérée ?',['Oui, toujours','Non','Oui, si le verre est brun'],1,'Un dépôt peut être présent dans une bière refermentée.']]},
 {name:'L’Escale des Étoiles',theme:'La conservation',reward:400,questions:[
  ['Quel contenant bloque la lumière ?',['Une bouteille transparente','Une bouteille verte','Une canette'],2,'Le métal empêche la lumière d’atteindre la bière.'],
  ['La chaleur tend à…',['Accélérer le vieillissement','Annuler l’oxydation','Nettoyer la bière'],0,'Les réactions de vieillissement sont accélérées par la chaleur.'],
  ['Une note de carton mouillé peut évoquer…',['Un houblon frais','Une oxydation','Une mousse parfaite'],1,'Le papier ou le carton mouillé sont des descriptions possibles de l’oxydation.'],
  ['Quel verre protège généralement le mieux de la lumière ?',['Le verre transparent','Le verre vert','Le verre brun'],2,'Le verre brun protège mieux que les verres clair ou vert.']]},
 {name:'L’Observatoire',theme:'Le verre et le service',reward:450,questions:[
  ['Un verre propre pour la bière doit notamment être…',['Sans résidus gras','Parfumé au savon','Couvert d’huile'],0,'Les résidus gras nuisent au service de la bière.'],
  ['Des bulles collées aux parois peuvent signaler…',['Un taux d’alcool élevé','Des impuretés dans le verre','Une bière forcément plus fraîche'],1,'Ces bulles peuvent se former sur des impuretés.'],
  ['La robe et la mousse se décrivent surtout…',['Avec l’ouïe','En lisant le prix','Par l’observation visuelle'],2,'La robe et la mousse font partie de l’aspect visuel.'],
  ['Pourquoi éviter les odeurs résiduelles dans le verre ?',['Elles peuvent masquer les arômes','Elles augmentent les XP','Elles changent la couleur du houblon'],0,'Un verre sans odeur parasite permet de mieux apprécier les arômes.']]}
 );
})();
