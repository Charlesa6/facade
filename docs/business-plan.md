# Konsilys — offre sites internet BTP : business plan (v0, pilote)

> Des sites internet clés en main pour les entreprises du BTP qui n'en ont pas, ou dont le site dessert l'image.
> On ne vend pas un outil, on vend le travail fait : **le site est déjà prêt quand on les contacte.**

## 1. Le problème

Une PME du bâtiment de 3 à 20 personnes est choisie sur recommandation, puis **vérifiée sur Google** : par le particulier, l'architecte, le maître d'œuvre, l'acheteur d'une collectivité. Pas de site, ou un site de 2012 illisible sur téléphone, c'est une entreprise qui paraît fermée, petite ou peu sérieuse. Les dirigeants le savent mais n'ont ni le temps ni l'envie de « faire un projet web » avec une agence (devis à 3 000 €, allers-retours, contenu à rédiger).

## 2. L'offre

| | **Site** | **Site + Google** | **Sérénité** |
|---|---|---|---|
| Mise en ligne | offerte | offerte | offerte |
| Abonnement | **39 € HT/mois** | **45 € HT/mois** | **69 € HT/mois** |
| Site | 1 page : présentation, prestations, horaires/zone, contact | idem | idem + galerie de photos enrichie chaque mois |
| Nom de domaine + hébergement + HTTPS | inclus | inclus | inclus |
| Fiche Google (Fiche d'établissement) | — | création ou reprise, complétée, reliée au site ; QR code « Laissez-nous un avis » | idem |
| Site et fiche toujours identiques | — | tout changement (horaires, numéro, fermeture) reporté sur les deux **le jour même** | idem |
| Suivi mensuel | — | — | photos et actualités publiées, horaires des jours fériés/vacances, réponses aux avis préparées |
| Modifications | 2 par mois | 2 par mois | illimitées |
| Engagement | 12 mois, puis mensuel | 12 mois, puis mensuel | 12 mois, puis mensuel |

Annuel = 10 × le mensuel (2 mois offerts). Grille fixée par Charles le 14/10/2026 : **39 € / 45 € / 69 € HT/mois**, création offerte sur les trois offres.

**Fiche Google : ce qu'on fait et ne fait pas.** La vérification de propriété est toujours faite par le commerçant (vidéo, appel ou SMS de Google) ; il ajoute ensuite Charles comme gestionnaire (jamais de mot de passe partagé). Outil : « Kit fiche Google » du studio (textes prêts à copier, QR code avis imprimable). Jamais de faux avis ni d'avis achetés (pratique commerciale trompeuse, suspension de la fiche), jamais de promesse de position. La synchronisation site/fiche est manuelle (le jour même) tant que l'accès à l'API Google Business Profile n'est pas obtenu ; à demander dès les premiers clients Sérénité pour automatiser le suivi mensuel.

Le client est **propriétaire de son nom de domaine** et peut partir avec son site (export HTML) : argument de confiance face aux offres « location de site » mal perçues dans le BTP.

## 3. La cible

- **Pilote : BTP, Rhône (69) puis Ain (01) / Isère (38)** : maçonnerie, couverture, électricité, plomberie-chauffage, menuiserie.
- **Taille** : 3 à 49 salariés (tranches INSEE 02 → 12). Les entreprises sans salarié achètent peu ; au-delà de 50, elles ont déjà une agence.
- **Signal de besoin** : aucun site trouvé, ou verdict `site_obsolete` de `prospection/audit.mjs` (pas mobile, pas HTTPS, copyright ancien, page vide).
- **Bonus** : entreprise **RGE** (donnée officielle de l'API) → le site met en avant la certification, argument fort pour les chantiers aidés (MaPrimeRénov').

## 4. Comment ça marche (les deux agents)

```
SIRENE (API publique) ──► sourcer.mjs ──► recherche du site web ──► audit.mjs
                                                           │
                    verdict aucun_site / site_obsolete ◄───┘
                                   │
         agent site-builder : profil vérifié ──► build.mjs --preview ──► maquette privée (noindex)
                                   │
         agent site-seller : email personnalisé avec le lien de SA maquette ──► relances ──► RDV / signature
                                   │
         signature : paiement Stripe ──► build.mjs (production) ──► domaine du client ──► en ligne
```

- **`site-builder`** : complète le profil (sources publiques uniquement), génère la maquette et la publie sur le domaine de prévisualisation. Il **n'invente rien** : pas d'avis clients, pas de certification non vérifiée, pas de photo de chantier qui ne soit pas la leur. Ce qui est générique est surligné « à valider » dans la maquette.
- **`site-seller`** : envoie la séquence d'emails (3 messages), détecte les réponses, gère les désinscriptions, prépare les appels, et passe le relais à Charles pour la signature.

## 5. Marque et séparation technique (décision du 12/10/2026)

L'offre est vendue **sous la marque Konsilys** (société de conseil de Charles, qui édite aussi le SaaS pour ESN). Les flux restent séparés pour protéger le produit :

| Élément | Offre sites BTP | SaaS Konsilys |
|---|---|---|
| Dépôt Git | `facade` (privé) | `esn-manager` |
| Domaine | **konsilys.com** | konsilys.fr |
| Emails de prospection (Resend) | konsilys.com | — (konsilys.fr = emails du produit) |
| Maquettes | `apercu.konsilys.com` (noindex) | — |
| Base de données | projet Supabase `facade` | `rwmstlesxnglpblrurqj` |

Une plainte ou un rebond sur la prospection n'affecte que la réputation de konsilys.com, jamais les invitations et factures du SaaS envoyées depuis konsilys.fr.

**À prévoir** : konsilys.com affiche aujourd'hui le site du SaaS pour ESN. Un artisan qui le visite après un email doit trouver l'offre sites internet (page dédiée ou page d'accueil « Konsilys, conseil » qui présente les deux activités).

## 6. Pilote : valider avant d'industrialiser

**Objectif** : savoir en 4 semaines si des artisans achètent un site qu'ils n'ont pas demandé.

1. 60 entreprises sourcées (Rhône, 3 métiers) → ~20 retenues (aucun site ou site obsolète, email publié).
2. 20 maquettes générées et relues par Charles.
3. 20 séquences de 3 emails.
4. Mesures : taux de réponse, taux de RDV, signatures, objections récurrentes, prix accepté.

**Seuils de décision** : ≥ 3 réponses positives et ≥ 1 signature → on industrialise (100 maquettes/semaine). 0 signature mais des réponses → on revoit l'offre/le prix. Moins de 2 réponses → on teste le téléphone ou un autre secteur avant d'abandonner.

## 7. Économie unitaire (hypothèses)

- Coût de production d'une maquette : quelques centimes (génération automatique) + 5 min de relecture.
- Coût d'un client en production : domaine ~8 €/an, hébergement ~0 € (Vercel, statique), Stripe ~1,5 %.
- **100 clients au panier moyen de 45 € ≈ 4 500 €/mois ≈ 54 k€/an de revenu récurrent**, marge brute > 90 %.
- Le vrai coût est le temps commercial (appels de closing) : c'est lui qu'il faut mesurer pendant le pilote.

## 8. Cadre légal (à faire valider par un juriste avant le passage à l'échelle)

- **Prospection B2B par email** : autorisée sans consentement préalable si le message concerne l'activité professionnelle du destinataire, avec un expéditeur identifié et une désinscription simple dans chaque email (doctrine CNIL). Adresses professionnelles publiées uniquement ; jamais d'adresse devinée.
- **Entrepreneurs individuels** : traiter leurs coordonnées comme des données personnelles (RGPD) : information à la première prise de contact (qui, pourquoi, source, droit d'opposition), conservation limitée (3 ans maximum après le dernier contact, maquette supprimée après 30 jours sans réponse).
- **Maquettes non sollicitées** : jamais référencées (noindex + robots.txt + URL non devinable), jamais présentées comme le site officiel de l'entreprise, bandeau « Maquette proposée par Konsilys », suppression sur simple demande.
- **L'émetteur (Konsilys) doit être identifié** (société ou activité déclarée) avec mentions légales et CGV avant le premier email.
- **Démarchage téléphonique** : réglementation en évolution (loi du 30 juin 2025 sur le démarchage non consenti) ; vérifier son application aux professionnels et aux entrepreneurs individuels avant tout appel à froid.

## 9. Points ouverts pour Charles

- [x] Marque : Konsilys, domaine konsilys.com (décidé le 12/10/2026).
- [x] Dépôt GitHub privé `facade`, projet Supabase `facade`.
- [ ] Domaine d'envoi Resend konsilys.com (enregistrements DNS chez OVH) et sous-domaine `apercu.konsilys.com`.
- [ ] Choisir l'entité juridique qui facture.
- [ ] Valider les prix du pilote.
