# Pilote — vague 1 (Rhône, 12/10/2026)

Chiffres agrégés uniquement : le détail par entreprise reste hors de Git (`data/`).

## Entonnoir

| Étape | Nombre |
|---|---|
| Entreprises examinées | 114 |
| … dont via SIRENE + recherche web (maçonnerie, couverture, électricité) | 97 |
| … dont via l'annuaire RGE de l'ADEME | 17 |
| Écartées : site correct | 53 |
| Écartées : pas d'email publié | 20 |
| Écartées : hors cible (filiale de groupe, franchise, ETI) | 14 |
| Écartées : fermée / en liquidation, identité incertaine, site à vérifier | 6 |
| **Retenues (maquette + email prêts, rien envoyé)** | **21** |

## Enseignements

1. **Le canal de sourcing compte plus que le métier.** La recherche web manuelle a donné 11 cibles en ~1 h de travail d'agent (11 % de rendement) ; l'annuaire RGE de l'ADEME en a donné 10 vérifiées en quelques minutes. L'ADEME fournit l'email **déclaré par l'entreprise** : source propre et traçable. → `prospection/rge.mjs` devient la source principale ; SIRENE + web en complément.
2. **Les meilleures cibles ne publient pas d'email.** En électricité, les 5 entreprises sans site n'avaient qu'un téléphone. Une part importante du marché n'est joignable que par **téléphone ou courrier**. Piste à tester : courrier papier avec QR code vers la maquette (B2B, pas de consentement requis, très différenciant pour des artisans).
3. **« Pas de site déclaré » ≠ « pas de site ».** 2 des 12 entreprises ADEME sans site déclaré en avaient un bon. La vérification web avant envoi reste obligatoire (sinon : « je n'ai pas trouvé votre site » à quelqu'un qui en a un).
4. **Beaucoup de domaines réservés sans site** (page OVH/IONOS par défaut, maintenance depuis 2023) : ce sont d'excellentes cibles, l'entreprise a déjà fait la démarche et ne l'a pas finie. Argument : « votre adresse xxx.fr n'affiche aucun site ».
5. **Les registres sont sales** : majuscules, accents perdus (« Rene », « Vaulx-En-Velin »), enseignes multiples, nom d'usage entre parenthèses, établissements secondaires remontés comme sièges. → `prospection/noms.mjs` et filtres de siège.
6. Un même dirigeant peut diriger plusieurs entreprises retenues → un seul email par personne (signalé dans la revue).

## Bloquant avant le premier envoi

Domaine, domaine d'envoi Resend, projet Supabase Façade (désinscription), entité juridique émettrice, et **validation par Charles des 21 fiches de la revue**.
