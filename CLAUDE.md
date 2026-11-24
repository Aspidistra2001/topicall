# TopiCall, le terrain

Corrigé joué du cas TopiCall (Nathalie Dumouchel, 2024, Prix du Cas AGRH 2024) pour les TD de GRH de L2 Économie-Gestion. L'étudiant·e incarne le ou la responsable RH qui vient d'être recruté·e et parcourt les sites de l'entreprise.

Page publiée : https://claude.ai/artifact/3pLmenV3LiMAb5EpsyR6si (privée tant qu'elle n'est pas partagée).

## Fichiers

- `index.html` : source de la page publiée. C'est un fragment (pas de `<!doctype>`, `<html>`, `<head>` ni `<body>` : ils sont ajoutés à la publication). Tout est dans ce fichier : CSS, données, moteur de rendu.
- `apercu.html` : la même page enveloppée dans un document complet, pour l'ouvrir en local dans un navigateur. À régénérer après chaque modification de `index.html` (voir plus bas).
- `check.js` : test Playwright qui régénère `apercu.html`, rejoue les 16 salles sur ordinateur et à largeur de téléphone, signale les erreurs et le débordement horizontal, et enregistre des captures.
- `livret-td.pdf` : le livret étudiant 2026-2027, source des énoncés. Diffusion interdite sans autorisation.

## Organisation de `index.html`

1. **Style** : jetons de couleur sur `:root`, repris pour le thème sombre (`prefers-color-scheme` et `data-theme`). Polices Bricolage Grotesque, Figtree, IBM Plex Mono.
2. **Introduction** (`.intro`) : repères sur le secteur des centres d'appels et liens vers deux vidéos (INA, YouTube).
3. **Données** (`SITES`) : cinq sites, chacun avec ses salles. Une salle porte un `script` (répliques `[qui, texte]`, `''` pour une didascalie), une activité `act` et le corrigé `keep` en HTML.
4. **Moteur isométrique** (`Iso`, `tower`, `FURN`, `drawPlan`) : immeubles de la carte et vues d'étage. Les `box` des salles sont en pixels d'un plan 360 x 300, divisés par 19 pour obtenir les unités du monde.
5. **Activités** : `classify` (classement ou vrai/faux), `plateau` (postes façon console de supervision), `pick` (choix sous budget ou en nombre limité), `spot` (passages fautifs à repérer).
6. **Poste de travail** (`CALL`, `poste`) : dans les quatre salles de plateau (`kind:'open'`), un bouton ouvre un écran où défile un modèle de plan d'appel sortant. Le défilement est automatique, sauf si le navigateur demande de réduire les animations.
7. **Matériel ergonomique** (`ERGO`, `ergo`, `chair`) : dans la salle de réunion de Marne-la-Vallée (`ergo:1`), un bouton ouvre sept fiches dessinées en SVG (fauteuil, bureau assis-debout, souris verticale, bras d'écran, casque, repose-pieds, cloisons). Ce sont des dessins, pas des photos.
8. **Navigation** : une vue par ancre (`#carte`, `#marne`, `#lille`, `#lyon`, `#marseille`, `#bordeaux`). La progression est gardée dans `localStorage`, par navigateur.

## Correspondance avec le livret

| Site | TD | Salles |
|---|---|---|
| Marne-la-Vallée | TD 3, conditions de travail | direction, plateau, pause, réunion |
| Lille | TD 4, recrutement | direction, plateau, réunion, formation |
| Lyon | TD 5, motivation | accueil, bureau RH, plateau, réunion |
| Marseille | TD 6, évaluation | chef d'équipe, plateau, réunion |
| Bordeaux | TD 3, question 4 | réunion |

Non couverts : TD 2, séquence 3 du TD 6, question 1 du TD 1, TD 7 à 9.

## Vérifier une modification

```bash
node check.js
```

Le script demande Playwright et Chromium. Il écrit `apercu.html` et des captures `d-*.png` (ordinateur) et `m-*.png` (téléphone) dans ce dossier.

## Contraintes de la page publiée

- Scripts externes uniquement depuis cdnjs, jsDelivr, unpkg ; feuilles de style externes uniquement depuis Google Fonts.
- Pas d'iframe : les vidéos sont des liens qui s'ouvrent dans un nouvel onglet.
- Pas de `alert`, `confirm`, `prompt`, ni d'impression.
- La page doit tenir à 400 px de large sans défilement horizontal du corps ; seule la vue d'étage défile dans son cadre.

## Points en suspens

- **Le corrigé est une proposition** rédigée à partir du livret étudiant seul. Il doit être aligné sur la correction faite en TD.
- **Vidéos** : les deux pages n'ont pas pu être consultées. Les intitulés des liens et les consignes de visionnage sont génériques.
- **Chiffres du secteur** : tirés de résumés de recherche (Insee, EY pour le SP2C, Xerfi, INRS), données 2019 à 2021, à contrôler sur les documents.
- **Droit** : encadrement du démarchage téléphonique, convention collective et codes ROME (D1408, D1402) cités de mémoire.
- **Prénoms et répliques** inventés, sauf les verbatims de l'enquête du TD 5. Le plan d'appel du poste de travail est inventé lui aussi.
- **Diffusion** : le livret interdit la diffusion des supports sans autorisation et précise que les corrigés de TD ne sont pas diffusés.
