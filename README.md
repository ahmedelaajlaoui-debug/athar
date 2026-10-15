# ATHAR — site web frontend

ATHAR est une plateforme de démonstration pour le patrimoine et l'artisanat du Sahara marocain : **Patrimoine**, **Boutique**, **Expériences**.
Projet 100 % frontend : HTML5, un seul fichier CSS, JavaScript « vanilla ». Pas de framework, pas de backend, pas de base de données.

## Lancer le site

**Option 1 — le plus simple :** double-cliquez sur `index.html` (il s'ouvre dans votre navigateur).

**Option 2 — avec un petit serveur local** (recommandé, plus proche d'un vrai site) :

```bash
cd athar
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

> Une connexion internet est utile pour les photos et les polices (voir « Images »). Sans elle, le site reste complet : des illustrations de remplacement s'affichent.

## Parcours de démonstration conseillé

Accueil → Patrimoine → Explorer (carte du Sahara) → Boutique → Produit → Artisan → Passeport patrimonial → Expédition → Panier → Commande.

## Structure du projet

```
athar/
├── index.html … checkout.html   15 pages HTML (une par écran)
├── css/style.css                Tout le design : variables, boutons, cartes, formulaires, responsive
├── js/
│   ├── data.js                  Données d'exemple (produits, artisans, villes, expériences, tarifs)
│   ├── icons.js                 Jeu d'icônes SVG unique (remplace tous les emojis) + logo en ligne
│   ├── translations.js          Textes de l'interface partagée en FR / EN / AR
│   ├── i18n.js                  Moteur de langue : AA.t(), langue enregistrée, sens RTL pour l'arabe
│   ├── main.js                  Chargé partout : header/footer, favoris, panier, messages, cartes réutilisables
│   └── <page>.js                Un fichier par page qui a de l'interactivité
├── assets/
│   ├── icons/logo.svg           Logo ATHAR complet (symbole + nom)
│   ├── icons/logo-mark.svg      Symbole seul (étoile à 8 branches + arc + dune)
│   ├── icons/favicon.svg
│   └── images/                  Réservé à vos propres photos locales
└── README.md
```

**Ordre des scripts dans chaque page :** `data.js` → `icons.js` → `translations.js` → `i18n.js` → `main.js` → script de la page.
Le header et le footer ne sont écrits qu'**une seule fois** (dans `main.js`) : les pages contiennent juste `<div id="site-header">` et `<div id="site-footer">`.

Fichiers ajoutés par rapport à la liste de départ : `icons.js`, `translations.js`, `i18n.js` (phase 1), `data.js` (données partagées), `index.js`, `patrimoine.js`, `artisans.js`, `impact.js`, `profil.js` (pages qui ont besoin d'un peu de JavaScript).

## Pages et fonctionnalités

| Page | Fonctionnalités |
|---|---|
| Accueil | Hero, 3 portes d'entrée, produits à la une, frise « De l'atelier à chez vous », destinations sahariennes, lectures sur la culture hassanie (FR / EN / AR) |
| Explorer | Carte illustrée du Sahara marocain (côte atlantique et désert, **sans frontières ni limites administratives**), 7 destinations placées d'après leurs coordonnées, panneau d'aperçu, cartes avec « Découvrir cette région » et « Voir sur la carte » (FR / EN / AR) |
| Région | `region.html?city=laayoune` : un seul modèle pour les 7 destinations (introduction, identité culturelle, 3 lieux/traditions, savoir-faire associés, retour à la carte, destination précédente/suivante) |
| Patrimoine | Culture hassanie : 5 savoir-faire (melhfa, bijoux, tissage et tentes, cuir, bakhour), 4 articles (thé et hospitalité, musique et poésie, cuisine, désert et oasis), motifs illustrés, « Saviez-vous que ? » (FR / EN / AR) |
| Savoir-faire | `savoir-faire.html?id=melhfa` (ou `bijoux`, `tapis`, `cuir`, `bakhour`, `the`, `musique-poesie`, `cuisine`, `oasis`) : un seul modèle pour les 9 fiches (FR / EN / AR) |
| Artisans | Recherche, filtres ville / métier / coopérative vérifiée, fiche profil détaillée, liens vers produits |
| Boutique | Recherche, 5 catégories, filtres (prix, destination, type d'artisanat, vérifiées, stock), tri, « Voir plus », état vide, favoris, ajout au panier |
| Produit | `produit.html?id=p1` : galerie, quantité, panier, favori, « Acheter maintenant », artisan, technique, teaser du passeport, produits similaires |
| Passeport | `passeport.html?id=p1` : fiche patrimoniale, 3 langues (titres), zone QR, lien copiable |
| Expériences | Cartes filtrables, formulaire de demande avec validation et confirmation |
| Expédition | Parcours visuel, comparatif mutualisée / express, simulateur de coût |
| Coffret | Occasion, ajout/retrait de produits, message, aperçu de la boîte, prix en direct, réinitialiser, confirmer (ajoute au panier) |
| Impact | Objectifs et compteurs animés (données de démo) |
| Favoris | Produits et artisans, enregistrés dans `localStorage`, états vides |
| Profil | Infos modifiables, commandes, produits sauvegardés, passeports consultés, demandes d'expériences |
| Panier | Quantités, suppression, totaux, panier vide, `localStorage` |
| Commande | Coordonnées, adresse, livraison, résumé, validation, écran de confirmation |

## Données enregistrées dans le navigateur (localStorage)

`aa_favs`, `aa_cart`, `aa_orders`, `aa_requests`, `aa_passports`, `aa_profile`, `aa_lang` (langue choisie : `fr`, `ar` ou `en`), et depuis les comptes : `aa_demo_account`, `aa_coops`, `aa_coop_products`, `aa_coop_jobs` (voir « Comptes — Phase 2 »).
Le bouton « Effacer les données de démo » du profil les supprime.

## Langues (français, arabe RTL, anglais)

- Le sélecteur de langue (globe, dans le header) enregistre le choix dans `aa_lang` et recharge la page. L'arabe passe automatiquement la page en `dir="rtl"` et active la police Cairo.
- **État actuel (phase 1) :** l'interface partagée est traduite dans les 3 langues : header, menus, recherche, pied de page, titres d'onglet, cartes produit/artisan, messages (toasts), états vides, prix (MAD / درهم), noms de villes et catégories.
- **Pas encore traduit :** les textes propres à chaque page (titres de sections, paragraphes, formulaires) et les données d'exemple (noms de produits, descriptions). Ils restent en français ; une règle CSS provisoire (fin de `style.css`) garde leur ponctuation correcte en mode RTL.
- Ajouter un texte : créer la même clé dans les 3 blocs de `translations.js`, puis `AA.t("ma.cle")` en JavaScript ou `data-i18n="ma.cle"` en HTML (`data-i18n-attr="placeholder:ma.cle"` pour un attribut).
- Une page peut mettre `data-lang-mode="soft"` sur `<body>` pour changer de langue sans rechargement (utile pour un formulaire) ; sinon la page se recharge.

## Identité visuelle

- Nom : **ATHAR** (أثر en arabe). Logo : étoile à 8 branches (khatem) en vert, arc en fer à cheval et ligne de dune, couleurs du site (`assets/icons/`).
- Icônes : `AA.icon("nom")` en JS, ou `<span data-icon="nom"></span>` en HTML (liste dans `icons.js`). Plus aucun emoji décoratif dans le site.
- Les clés `localStorage` (`aa_*`) et l'objet JavaScript `AA` gardent leur nom d'origine pour ne pas perdre les données déjà enregistrées.

## Images

- Les photos viennent d'**Unsplash** (adresses dans `js/data.js`, section `photos` et `categoryPhotos`). Elles n'ont **pas pu être vérifiées** pendant la création du projet (pas d'accès internet dans l'environnement de travail). Certaines adresses peuvent donc ne plus fonctionner ou ne pas montrer exactement le sujet attendu.
- Si une image ne charge pas, `AA.fallback()` (dans `main.js`) la remplace par une illustration colorée. Les bannières affichent un dégradé de désert.
- Pour des photos fiables : placez vos fichiers dans `assets/images/` et remplacez les adresses dans `data.js`.

## Avertissements honnêteté / contenus de démonstration

- Les **artisans, coopératives, prix, stocks, délais et compteurs d'impact sont fictifs**.
- Les **significations des motifs** et les anecdotes sont **illustratives**, pas des faits historiques vérifiés.
- Le carré du passeport est un **motif décoratif, pas un vrai QR code** ; le lien réel du passeport est affiché à côté.
- Aucun **paiement** n'est traité, aucune carte bancaire n'est demandée ; aucune **réservation** ou **expédition** réelle n'existe.
- Le profil n'a **pas de vraie authentification**.

## Limites qui nécessiteraient un backend

- Comptes utilisateurs, connexion et sécurité.
- Paiement en ligne réel, facturation, suivi de colis.
- Stocks, commandes et réservations partagés entre utilisateurs (ici : un seul navigateur).
- Gestion des produits et artisans par les coopératives (back-office).
- Vrai QR code lié à une adresse publique (il faut un site hébergé), vidéos d'ateliers, e-mails/WhatsApp de confirmation.
- Vraie carte géographique avec services externes.

## Conseils pour la suite

- Modifier le design : variables au début de `css/style.css` (couleurs, polices, arrondis).
- Ajouter un produit : une ligne `makeProduct(...)` dans `js/data.js`.
- Ajouter une page : copier une page existante, changer `data-page`, ajouter le lien dans `NAV_LINKS` ou le footer de `main.js`.


## Périmètre : le Sahara marocain uniquement

ATHAR est consacré au Sahara marocain, à ses destinations, à la culture hassanie et à son artisanat. Le contenu général sur le Maroc a été retiré.

- **Destinations** (`js/regions.js`) : Laâyoune, Dakhla, Smara (région d'Es-Semara), Boujdour, Tarfaya, ainsi que Guelmim et Tan-Tan présentées comme portes du Sahara (le moussem de Tan-Tan est inscrit à l'UNESCO).
- **Carte** : seul le littoral atlantique est dessiné ; aucune frontière, aucune limite administrative, aucun nom de pays. Les lieux sont seulement nommés et placés d'après leurs coordonnées.
- **Contenu culturel** (`js/crafts.js`) : vêtements (melhfa, daraâ), bijoux, tissage et tente, cuir, bakhour, thé et hospitalité, musique, poésie et tradition orale, cuisine, désert et oasis.
- **Boutique, artisans, expériences, coffret, expédition** : données de démonstration déjà sahariennes (Laâyoune, Dakhla, Smara, Boujdour), conservées. Les profils d'artisans et de coopératives sont **fictifs**.
- **Livraison simulée** : villes sahariennes, plus Agadir et Casablanca comme grands points de livraison (prix et délais illustratifs).
- Aucune coopérative, entreprise, adresse ou contact réel n'est cité. Quand une information fiable n'est pas compilée (par exemple les savoir-faire propres à Tarfaya), la page l'indique.

### Ajouter une destination ou une fiche
- Destination : ajouter un objet dans `AA.regions` (`js/regions.js`) avec ses textes `{fr, en, ar}` ; la carte, les cartes, la page et les liens suivent.
- Fiche culturelle : ajouter une entrée dans `AA.crafts` ou `AA.topics` (`js/crafts.js`) et un dessin dans `AA.craftArt`.

### Langues (français, anglais, arabe)
Le mécanisme existant est conservé : `AA.t("clé")` / `data-i18n`, la langue est enregistrée dans `aa_lang`, l'arabe passe la page en `dir="rtl"`.
- Entièrement traduits : accueil, Explorer, pages Région, Patrimoine, fiches Savoir-faire, en-tête et pied de page, cartes partagées.
- **Pas encore traduits** (textes français écrits en dur dans les pages et dans `data.js`) : boutique, produit, passeport, artisans, expériences, expédition, coffret, impact, favoris, profil, panier, commande, ainsi que les descriptions des produits, artisans et expériences. **Cause :** ces pages n'utilisent pas `data-i18n` et leurs scripts contiennent le français directement. C'est l'objet de la phase de traduction restante.

### Fichiers de la correction « Sahara uniquement »
Nouveaux : `region.html`, `js/region.js`, `js/regions.js`, `js/regions-i18n.js`, `js/regions-ui.js`, `js/pages-i18n.js`.
Réécrits : `explorer.html`, `js/explorer.js`, `index.html`, `js/index.js`, `patrimoine.html`, `js/patrimoine.js`, `js/savoir-faire.js`, `js/crafts.js`.
Modifiés : `css/style.css` (sections ajoutées en fin de fichier), `js/main.js` (onglet Explorer actif sur la page Région), `js/data.js` (villes de livraison), `savoir-faire.html` (un script).
Ordre des scripts des pages concernées : `data.js` → `crafts.js` → `icons.js` → `translations.js` → `regions.js` → `regions-i18n.js` → `pages-i18n.js` → `i18n.js` → `main.js` → `regions-ui.js` → script de la page.

### Reste à faire
- Traduire FR/EN/AR les pages transactionnelles et les données de démonstration listées ci-dessus, puis supprimer la règle RTL provisoire de `style.css` et tester chaque page dans les trois langues.
- Vérifier avec des sources locales les textes culturels avant toute publication, et ajouter de vraies photos si elles sont disponibles (le dossier `assets/images/` est prévu).

## Comptes — Phase 1 (démonstration frontend)

- `inscription.html` : choix du compte (Coopérative, Client, Chercheur d'emploi, Visiteur) + trois formulaires. Accès direct : `inscription.html#coop`, `#client`, `#job`.
- `js/inscription.js` (logique, validation), `js/inscription-i18n.js` (textes FR/EN/AR), styles en section 13 de `css/style.css`.
- Aucun backend ni vraie authentification. Le mot de passe n'est jamais stocké ; les images ne sont qu'un aperçu. Seuls nom, email et choix non sensibles sont gardés en localStorage (`aa_demo_account`, `aa_profile`).
- Pas encore fait : tableau de bord coopérative, connexion, phases suivantes, réparation globale des traductions.


## Comptes — Phase 2 : tableau de bord coopérative (démonstration frontend)

### Ce qui a été ajouté
- `cooperative.html` + `js/cooperative.js` : tableau de bord en 3 onglets (**Profil**, **Mes produits**, **Mes offres d'emploi**).
  - Profil : nom, logo/photo, email, WhatsApp, région du Sahara, catégorie d'activité, description (validation + messages d'erreur / succès).
  - Produits : liste de **ses** produits, ajout, modification, suppression avec confirmation (nom, description, catégorie, prix, stock facultatif, image facultative).
  - Offres d'emploi : liste de **ses** offres, création, modification, suppression (intitulé, description, domaine, région, case « afficher mes coordonnées », décochée par défaut).
- `js/coop-data.js` (chargé sur **toutes** les pages, juste après `translations.js`) : lit le contenu coopérative dans `localStorage` et **fusionne les produits dans `AA.products`**. La boutique, la fiche produit, les favoris, le panier, le coffret, le passeport, la recherche, les filtres et le tri fonctionnent donc sans logique en double. Les produits de coopérative portent l'étiquette « Démo coopérative ».
- `emploi.html` + `js/emploi.js` : **cette page n'existait pas dans le projet Phase 1 ; elle a été créée** (recherche, filtres région / domaine, cartes d'offres, état vide). Elle affiche les offres des coopératives + 3 exemples fictifs clairement étiquetés « Exemple de démonstration » (aucun vrai poste, aucune vraie coopérative ni coordonnée).
- `js/coop-i18n.js` : textes FR / EN / AR (arabe en RTL) du tableau de bord et de la page Emploi. Les libellés de formulaire réutilisent les clés `ins.*` de la phase 1.
- Liens : sous-menu Expériences → « Offres d'emploi », pied de page (Offres d'emploi, Espace coopérative), écran de confirmation d'inscription coopérative → « Ouvrir mon espace coopérative ».
- Petites modifications : `main.js` (menus, pied de page, étiquette sur les cartes), `produit.js` (pas de « motif » inventé pour un produit de coopérative), `boutique.js` (les villes des produits de coopérative, par ex. Tarfaya, apparaissent dans le filtre de destination), `inscription.js` (bouton vers le tableau de bord), `icons.js` (icônes `edit`, `trash`, `plus`, `dashboard`), `style.css` (section 14 + correction du débordement de l'en-tête sur petits écrans).

### Utiliser la démo
1. Créer un compte coopérative (`inscription.html#coop`) puis « Ouvrir mon espace coopérative », **ou** ouvrir `cooperative.html` et cliquer « Ouvrir une coopérative de démo ».
2. Compléter le profil (obligatoire avant d'ajouter produits ou offres), puis ajouter un produit : il apparaît dans `boutique.html`. Créer une offre : elle apparaît dans `emploi.html`.
3. « Supprimer toutes les données de ma coopérative de démo » (bas de page) efface profil, produits, offres et la session de démo.

### Stockage (localStorage, données de démonstration non sensibles)
| Clé | Contenu |
|---|---|
| `aa_demo_account` | compte de démo (type, nom, email, région, catégorie, `coopId`). **Jamais de mot de passe.** |
| `aa_coops` | `{ coopId: profil }` : nom, email, WhatsApp, région, catégorie, description, logo réduit (≤ 256 px) |
| `aa_coop_products` | produits, chacun avec `ownerId` ; image réduite (≤ 640 px, JPEG) |
| `aa_coop_jobs` | offres, chacune avec `ownerId` |

Utilisez de préférence un e-mail et un numéro **fictifs** : ils sont enregistrés en clair dans le navigateur, et affichés sur une offre uniquement si la coopérative coche « afficher mes coordonnées ».

### Limites honnêtes (à lire)
- **Pas de backend, pas de base de données, pas de vraie authentification, pas de publication réelle.** Tout reste dans **un seul navigateur** : aucun autre visiteur, aucun autre appareil ne voit ces produits ou ces offres, et il n'y a aucune synchronisation.
- Chaque tableau de bord n'affiche et ne modifie que les éléments dont le `ownerId` correspond à la coopérative courante (vérifié aussi avant chaque modification ou suppression). **Ce n'est PAS une permission sécurisée** : n'importe qui peut ouvrir les outils du navigateur et lire ou changer `localStorage`. Une vraie plateforme doit faire ces contrôles côté serveur.
- La « coopérative courante » vient du compte de démo de la phase 1. Créer un autre compte coopérative crée une autre coopérative ; le contenu de la précédente reste dans le navigateur (et visible dans la boutique) tant qu'on ne l'a pas supprimé depuis son tableau de bord.
- Les images sont réduites et gardées dans `localStorage` (≈ 5 Mo au total). Si le stockage est plein, un message d'erreur clair est affiché et rien n'est enregistré.
- Les contenus saisis par l'utilisateur (noms, descriptions) ne sont pas traduits automatiquement : ils s'affichent dans la langue où ils ont été écrits.
- Non fait (hors périmètre de cette phase) : connexion, rôles complets, espace client / chercheur d'emploi, candidature aux offres, phases suivantes.


## Comptes — Phase 3 : client, chercheur d'emploi et visiteur (démonstration frontend)

### Ce qui a été ajouté
- `js/account.js` (chargé sur **toutes** les pages) : rôle de démonstration courant (`visitor`, `client`, `job`, `coop`), menu de profil du header et colonne « Mon espace » du pied de page **adaptés au rôle**, petits profils non sensibles.
- `js/account-i18n.js` : textes FR / EN / AR (arabe en RTL) de `profil.html` et des nouveautés de `emploi.html`.
- `profil.html` + `js/profil.js` (réécrits) : une page « Mon espace » selon le rôle.
  - **Client** : onglets Informations (nom, email, ville facultative, savoir-faire qui m'intéressent), **Favoris** (produits + coopératives/artisans, mêmes données que `favoris.html`), **Panier** (quantités +/−, suppression, sous-total, lien vers le panier complet), **Découvrir** (boutique, profils de coopératives, catégories). L'ancien onglet « Commandes » n'est plus affiché : aucun historique de commande, paiement ou achat n'est inventé.
  - **Chercheur d'emploi** : Informations, **Compétences et préférences** (compétences ajoutables/supprimables, région du Sahara souhaitée, domaines, niveau et description de l'expérience), **Offres pour moi** (offres correspondant à la région et aux domaines choisis).
  - **Coopérative** : carte vers le tableau de bord existant (`cooperative.html`, onglets produits et offres) — le tableau de bord de la phase 2 n'est pas modifié.
  - **Visiteur** : navigation publique et lien d'inscription facultatif.
  - Sous chaque rôle : « Essayer un autre rôle de démonstration » (pour tester chaque interface sans inscription) et « Effacer les données de démo ».
- `emploi.html` + `js/emploi.js` : recherche par mot-clé, filtres région / domaine, case « seulement les offres qui correspondent à mon profil » (rôle chercheur d'emploi), **page de détail** `emploi.html?job=ID`, boutons de contact **uniquement si une coordonnée valide existe** : email (`mailto:`) si l'adresse est valide, WhatsApp (`https://wa.me/…`) si le numéro est valide. Sinon un message l'indique. Les annonces d'exemple n'ont jamais de coordonnées.
- Navigation par rôle : Client = profil, favoris, panier, boutique, coopératives ; Chercheur d'emploi = profil, offres d'emploi ; Coopérative = tableau de bord, produits, offres ; Visiteur = création de compte facultative. Le bloc « Vous représentez une coopérative ? » de `emploi.html` est masqué pour les clients et chercheurs d'emploi.
- Petites modifications : `main.js` (header + pied de page), `inscription.js` (le nouveau compte devient le rôle courant ; les compétences/expérience saisies à l'inscription chercheur d'emploi sont reprises dans le profil), `cooperative.js` (le menu suit le démarrage de la coopérative démo ; les liens `cooperative.html#jobs` fonctionnent aussi quand le tableau de bord est déjà ouvert), `style.css` (section 15 + règle `[hidden]`), une balise `<script src="js/account.js">` dans chaque page.

### Visiteurs
Aucune page publique n'exige un compte et aucune fenêtre d'inscription n'apparaît : accueil, Explorer, régions, patrimoine, coopératives/artisans, boutique, produits et offres d'emploi restent ouverts. L'inscription est seulement proposée (icône du header, menu, pied de page).

### Stockage (localStorage, démonstration, non sensible)
| Clé | Contenu |
|---|---|
| `aa_demo_role` | rôle choisi sur `profil.html` (prioritaire sur le type du compte de démo) |
| `aa_client_profile` | ville (facultative) et savoir-faire préférés |
| `aa_job_profile` | compétences, région souhaitée, domaines, niveau et description d'expérience |
| (existantes) | `aa_profile`, `aa_demo_account`, `aa_favs`, `aa_cart`… voir plus haut |

**Aucun mot de passe n'est stocké.** Utilisez de préférence des données fictives.

### Limites honnêtes (à lire)
- **Les rôles et les données de compte sont des démonstrations.** Il n'y a pas d'authentification sécurisée, pas de backend, pas de base de données, pas de synchronisation entre appareils.
- **Le rôle ne protège rien** : il ne change que les liens et écrans affichés. N'importe qui peut ouvrir une page par son adresse ou modifier `localStorage` avec les outils du navigateur. De vrais contrôles d'accès demandent un serveur.
- **Aucune candidature** n'est envoyée ni enregistrée : il n'existe pas de formulaire de candidature. Le chercheur d'emploi contacte lui-même la coopérative via les liens affichés (email / WhatsApp) quand ils existent. ATHAR ne sait pas si un message a été envoyé ou lu.
- Les préférences du chercheur d'emploi servent uniquement à filtrer les offres dans ce navigateur ; elles ne sont transmises à aucune coopérative.
- Le panier du profil réutilise le panier existant ; aucun paiement ni achat n'est réalisé. L'ancien onglet « Commandes » du profil a été retiré de l'interface (les clés `aa_orders` restent lisibles par `checkout.html` comme avant).
- Les icônes du header Favoris et Panier restent visibles pour tous les rôles (la boutique est publique).
- Texte du profil : les étiquettes du profil et de l'emploi sont traduites FR/EN/AR ; les contenus saisis par les utilisateurs ne sont pas traduits.

### Tests effectués (navigateur Chromium automatisé, sans accès aux images externes)
Navigation visiteur sur 7 pages publiques ; changement de rôle ; modification et persistance du profil client (validation d'email) ; favoris (ajout/retrait) ; panier (quantités, suppression, badge) ; profil chercheur d'emploi (compétences sans doublon, région, domaines, expérience, persistance) ; offres correspondant au profil ; recherche mot-clé / région / domaine / état vide ; page de détail et offre introuvable ; liens email et WhatsApp valides et absence de lien si la coordonnée est invalide ou non publiée ; tableau de bord coopérative (profil, offres, produit, liens de menu avec ancre, produit visible dans la boutique, données intactes après changement de rôle) ; inscriptions client et chercheur d'emploi (aucun mot de passe dans localStorage) ; débordement horizontal à 375 px en français et en arabe (RTL) ; syntaxe de tous les fichiers JS (`node --check`) ; liens internes.
**Non testés :** Firefox et Safari, vrais appareils mobiles, lecteurs d'écran, relecture de l'arabe par un locuteur natif, ouverture de WhatsApp / du client mail (seul le lien généré est vérifié), chargement des photos Unsplash (pas d'internet dans l'environnement de test).
Phase 4/4 (intégration finale) : **non commencée**.
