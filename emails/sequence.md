# Séquence de prospection — sites internet (modèles)

Variables : `{site_de}` (« Le site de X » / « Le site d'X »), `{de_entreprise}` (« de X » / « d'X »), `{entreprise}`, `{prenom_nom}` (dirigeant publié, sinon « Bonjour, »), `{ville}`, `{lien_maquette}`, `{probleme}` (premier problème de l'audit, ou « je n'ai pas trouvé de site internet pour X »), `{pied}` (signature + désinscription, voir `.claude/agents/site-seller.md`).
Variables par métier (`prospection(metier)` dans `generator/metiers.mjs`) : `{pros}` (« des couvreurs », « des restaurants »…), `{clientele}` (« des entreprises du bâtiment » / « des commerces lyonnais »), `{photos}` (« photos de vos chantiers », « photos de vos plats »…), `{contenu}` (ce que montre la maquette).

Toujours personnaliser au moins une phrase. Texte brut, pas d'image, pas de pièce jointe. Tarifs : dès 39 € HT/mois (Site), 45 € (Site + Google), 69 € (Sérénité), création offerte. Les emails n'annoncent que « 39 € HT par mois » ; le détail des offres se donne au téléphone ou en réponse.

---

## Email 1 (J0) — la maquette

**Objet** : {site_de} (déjà prêt)

Bonjour {prenom_nom},

Je m'appelle Charles Allouard : après plus de 5 ans de conseil en informatique, je crée à Lyon les sites internet {clientele}. En cherchant {pros} à {ville}, {probleme}.

J'ai donc préparé une maquette du site {de_entreprise}, à partir de vos informations publiques :
{lien_maquette}

Elle est privée (invisible sur Google). Si elle vous plaît, on la corrige ensemble et elle est en ligne sous votre nom en 48 h, pour 39 € HT par mois, domaine et hébergement compris.

Je vous propose d'en parler 10 minutes cette semaine : dites-moi quand vous êtes disponible, ou appelez-moi directement au 06 71 58 20 74.

Charles Allouard

{pied}

---

## Relance 1 (J+4 ouvrés) — l'usage

**Objet** : Re: {site_de} (déjà prêt)

Bonjour {prenom_nom},

Vos futurs clients, même quand ils vous ont été recommandés, vérifient souvent votre entreprise sur leur téléphone avant de venir ou d'appeler.

Votre maquette est faite pour ça : {contenu}.
{lien_maquette}

Voulez-vous que je l'adapte (textes, {photos}) ? Le plus simple est d'en parler de vive voix : je suis joignable au 06 71 58 20 74.

Charles Allouard

{pied}

---

## Relance 2 (J+10 ouvrés) — la clôture

**Objet** : Re: {site_de} (déjà prêt)

Bonjour {prenom_nom},

Je ne vous relancerai plus : je supprime la maquette {de_entreprise} à la fin du mois, sauf si elle vous intéresse.

{lien_maquette}

Si vous voulez en parler, je reste joignable au 06 71 58 20 74.

Bonne continuation,
Charles Allouard

{pied}
