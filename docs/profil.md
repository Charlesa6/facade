# Format du profil d'entreprise

Un profil = un fichier JSON passé à `generator/build.mjs`. Les brouillons sont produits par `prospection/sourcer.mjs` dans `data/profils/` (non versionné) ; des exemples fictifs sont dans `profiles/exemples/`.

| Champ | Obligatoire | Description |
|---|---|---|
| `slug` | non | Identifiant URL (déduit du nom sinon). |
| `raison_sociale` | oui* | Dénomination légale (mentions légales, pied de page). |
| `nom_commercial` | oui* | Nom affiché (enseigne). *L'un des deux est requis. |
| `metier` | oui | Clé de `generator/metiers.mjs` : `maconnerie`, `couverture`, `electricite`, `plomberie`, `menuiserie`, `peinture`, `paysage`, `terrassement`, `general`. Fixe la palette, le pictogramme et les prestations par défaut. |
| `metier_label` | non | Libellé du métier s'il diffère du préréglage. |
| `forme_juridique`, `siren`, `annee_creation`, `effectif` | non | Affichés dans « En bref » et les mentions légales. |
| `ville`, `code_postal`, `adresse` | non | Coordonnées. |
| `zone_intervention` | non | Liste de villes/secteurs (par défaut : `ville`). |
| `telephone`, `email`, `horaires` | non | Contact ; sans téléphone ni email, les boutons d'appel disparaissent. |
| `accroche`, `description`, `histoire` | non | Textes. Sans `description`, un texte générique **surligné « à valider »** est utilisé. |
| `services` | non | `[{ "titre", "description", "a_valider"? }]`. Sans liste, les prestations types du métier sont utilisées, surlignées « à valider ». |
| `atouts` | non | Liste de phrases courtes, **réellement revendiquées par l'entreprise**. Sinon, trois atouts génériques à valider. |
| `certifications` | non | Badges (ex. `Entreprise RGE`). **Uniquement si vérifié** par une source officielle ou publié par l'entreprise. |
| `assurance_decennale` | non | Assureur et zone de couverture (mentions légales ; obligatoire en production pour les métiers concernés). |
| `directeur_publication` | non | Mentions légales (obligatoire en production). |
| `palette` | non | Surcharge `{ primary, accent, dark, soft }`. |
| `sources` | oui | URLs justifiant chaque information ajoutée. |

En mode `--preview`, tout ce qui est marqué « à valider » est surligné en jaune et un bandeau « Maquette » s'affiche. En production, ces marques disparaissent : il faut donc **valider les textes avec le client avant la mise en ligne**.
