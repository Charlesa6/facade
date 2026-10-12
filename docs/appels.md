# Canal téléphone : fiche d'appels

Les entreprises sans email publié (`fc_prospects.canal = 'telephone'`) sont appelées par Charles. Celles qui ont un email peuvent aussi être appelées.

1. Exporter la liste (outil MCP `execute_sql`, projet `hxxbhbfueqwsvwqrojea`), et enregistrer le tableau JSON obtenu dans un fichier **hors de Git** :

```sql
select json_agg(t) from (
  select company, contact_name, contact_role, phone, email, city, metier, site_verdict, website,
         site_problems->>0 as probleme, preview_url, canal, profile->>'effectif' as effectif,
         (profile->'certifications') ? 'Entreprise RGE' as rge
  from fc_prospects
  where status in ('a_contacter','sequence') and company <> 'TEST FICTIF'
  order by (phone is null), canal desc, city
) t;
```

2. `node prospection/appels.mjs --in <export.json> --out out/appels.html`

La fiche contient le script d'appel, les objections, et une carte par entreprise avec le numéro cliquable, l'accroche personnalisée (le constat sur son site) et le lien vers sa maquette. Elle propose aussi un SMS pré-rempli avec ce lien, et des cases pour noter le résultat (mémorisé sur l'appareil).

3. Après les appels, reporter les résultats en base :
   - intéressé → `rdv` ;
   - pas intéressé → `perdu` ;
   - « ne plus m'appeler » → `desinscrit`, ce qui supprime sa maquette.

Les créneaux de rappel vont dans `notes` et `next_action_at`.

Cadre : prospection entre professionnels, par téléphone, sur des numéros publiés par l'entreprise. Une demande d'opposition est respectée immédiatement.
