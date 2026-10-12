// Préréglages par métier (BTP et commerces de proximité) : palette, libellé, prestations types.
// Pour les emails : `activite` (« vous dirigez … »), `photos` (« … photos de vos chantiers »), sinon valeurs BTP par défaut.
// Les prestations par défaut sont des descriptions génériques du métier,
// signalées « à valider » dans la maquette tant que l'entreprise ne les a pas confirmées.
// `naf` : codes NAF (rév. 2) rattachés au métier, utilisés par le sourcing.

export const METIERS = {
  maconnerie: {
    label: 'Maçonnerie générale', pros: 'des maçons', naf: ['43.99C'],
    palette: { primary: '#9A3412', accent: '#F59E0B', dark: '#1C1917', soft: '#FFF7ED' },
    icon: 'brick',
    services: [
      ['Gros œuvre', 'Fondations, murs porteurs, dalles et chaînages pour la construction neuve.'],
      ['Extension & surélévation', 'Agrandissement de maisons et de locaux, de l\'étude à la mise hors d\'eau.'],
      ['Rénovation', 'Ouverture de murs porteurs, reprise en sous-œuvre, remise en état du bâti ancien.'],
      ['Aménagements extérieurs', 'Murets, clôtures, terrasses béton et dallages.'],
    ],
  },
  couverture: {
    label: 'Couverture & zinguerie', pros: 'des couvreurs', naf: ['43.91A', '43.91B'],
    palette: { primary: '#334155', accent: '#DC2626', dark: '#0F172A', soft: '#F1F5F9' },
    icon: 'roof',
    services: [
      ['Réfection de toiture', 'Tuiles, ardoises, bac acier : dépose et repose complète.'],
      ['Zinguerie', 'Gouttières, chéneaux, descentes et habillages.'],
      ['Isolation de toiture', 'Isolation par l\'extérieur (sarking) ou sous rampants.'],
      ['Dépannage & fuites', 'Recherche de fuite, remplacement de tuiles, bâchage d\'urgence.'],
    ],
  },
  electricite: {
    label: 'Électricité générale', pros: 'des électriciens', naf: ['43.21A', '43.21B'],
    palette: { primary: '#1E3A8A', accent: '#FACC15', dark: '#0B1220', soft: '#EFF6FF' },
    icon: 'bolt',
    services: [
      ['Installation neuve', 'Tableaux, circuits et appareillage aux normes NF C 15-100.'],
      ['Mise en conformité', 'Diagnostic et remise aux normes des installations anciennes.'],
      ['Tertiaire & locaux pro', 'Éclairage, courants faibles, bornes de recharge.'],
      ['Dépannage', 'Intervention rapide sur pannes et disjonctions.'],
    ],
  },
  plomberie: {
    label: 'Plomberie & chauffage', pros: 'des plombiers-chauffagistes', naf: ['43.22A', '43.22B'],
    palette: { primary: '#0369A1', accent: '#F97316', dark: '#082F49', soft: '#F0F9FF' },
    icon: 'drop',
    services: [
      ['Plomberie', 'Installation et rénovation des réseaux d\'eau, sanitaires, salles de bains.'],
      ['Chauffage', 'Chaudières, pompes à chaleur, planchers chauffants.'],
      ['Climatisation & ventilation', 'Climatisation réversible, VMC simple et double flux.'],
      ['Dépannage', 'Fuites, engorgements, panne de chauffage.'],
    ],
  },
  menuiserie: {
    label: 'Menuiserie', pros: 'des menuisiers', naf: ['43.32A', '43.32B', '16.23Z'],
    palette: { primary: '#78350F', accent: '#65A30D', dark: '#1C1917', soft: '#FEFCE8' },
    icon: 'window',
    services: [
      ['Menuiseries extérieures', 'Fenêtres, portes d\'entrée, baies vitrées, volets.'],
      ['Agencement intérieur', 'Placards, dressings, escaliers et habillages sur mesure.'],
      ['Charpente & ossature bois', 'Charpentes traditionnelles, extensions bois.'],
      ['Fermetures', 'Portails, portes de garage, stores.'],
    ],
  },
  peinture: {
    label: 'Peinture & revêtements', pros: 'des peintres en bâtiment', naf: ['43.34Z', '43.33Z'],
    palette: { primary: '#0F766E', accent: '#F472B6', dark: '#042F2E', soft: '#F0FDFA' },
    icon: 'brush',
    services: [
      ['Peinture intérieure', 'Préparation des supports, peinture, enduits décoratifs.'],
      ['Ravalement de façade', 'Nettoyage, traitement et mise en peinture des façades.'],
      ['Revêtements de sols', 'Parquet, sols souples, carrelage.'],
      ['Revêtements muraux', 'Papiers peints, toiles de verre, faïence.'],
    ],
  },
  paysage: {
    label: 'Aménagement paysager', pros: 'des paysagistes', naf: ['81.30Z'],
    palette: { primary: '#166534', accent: '#CA8A04', dark: '#052E16', soft: '#F0FDF4' },
    icon: 'leaf',
    services: [
      ['Création de jardins', 'Conception et réalisation d\'espaces verts.'],
      ['Entretien', 'Tonte, taille, désherbage, contrats d\'entretien annuels.'],
      ['Terrasses & allées', 'Bois, pierre, pavés, béton désactivé.'],
      ['Clôtures & arrosage', 'Clôtures, portails, arrosage automatique.'],
    ],
  },
  terrassement: {
    label: 'Terrassement & VRD', pros: 'des entreprises de terrassement', naf: ['43.12A', '43.12B', '42.11Z'],
    palette: { primary: '#854D0E', accent: '#EAB308', dark: '#1C1917', soft: '#FEFCE8' },
    icon: 'digger',
    services: [
      ['Terrassement', 'Décaissement, fouilles, plateformes et nivellement.'],
      ['VRD', 'Voirie, réseaux secs et humides, assainissement.'],
      ['Démolition', 'Démolition de bâtiments et évacuation des gravats.'],
      ['Assainissement', 'Fosses, micro-stations, raccordement au tout-à-l\'égout.'],
    ],
  },
  general: {
    label: 'Bâtiment tous corps d\'état', pros: 'des entreprises du bâtiment', naf: ['43.99A', '43.99B', '43.99D', '43.99E', '43.29A', '43.29B', '43.31Z', '43.39Z'],
    palette: { primary: '#1F2937', accent: '#F59E0B', dark: '#111827', soft: '#F9FAFB' },
    icon: 'crane',
    services: [
      ['Construction', 'Bâtiments neufs, du gros œuvre aux finitions.'],
      ['Rénovation', 'Rénovation complète de logements et de locaux professionnels.'],
      ['Second œuvre', 'Plâtrerie, isolation, cloisons, faux plafonds.'],
      ['Coordination de travaux', 'Un interlocuteur unique pour tous les corps d\'état.'],
    ],
  },
  // ── Commerces de proximité (famille « commerce ») : pas de devis ni de zone d'intervention, mais une
  // adresse, des horaires et un bouton d'action propre au métier (réserver, prendre rendez-vous, commander).
  restaurant: {
    famille: 'commerce', activite: 'un restaurant', photos: 'photos de vos plats et de la salle', schema: 'Restaurant',
    label: 'Restaurant', pros: 'des restaurants', naf: ['56.10A'],
    palette: { primary: '#9F1239', accent: '#FBBF24', dark: '#1C1917', soft: '#FFF1F2' },
    icon: 'plate',
    cta: 'Réserver une table', titreServices: 'Notre maison',
    description: '{name} vous accueille {a_ville} pour le déjeuner et le dîner : une cuisine faite maison, des produits frais et un accueil chaleureux.',
    atouts: ['Cuisine faite maison', 'Produits frais et de saison', 'Réservation par téléphone'],
    services: [
      ['Sur place', 'Une salle chaleureuse pour vos déjeuners et dîners.'],
      ['La carte', 'Des plats faits maison qui changent au fil des saisons.'],
      ['À emporter', 'Vos plats préférés à emporter, sur commande.'],
      ['Groupes & privatisation', 'Repas d\'entreprise, anniversaires et événements.'],
    ],
  },
  coiffure: {
    famille: 'commerce', activite: 'un salon de coiffure', photos: 'photos du salon et de vos réalisations', schema: 'HairSalon',
    label: 'Salon de coiffure', pros: 'des salons de coiffure', naf: ['96.02A'],
    palette: { primary: '#6D28D9', accent: '#F472B6', dark: '#1E1B4B', soft: '#F5F3FF' },
    icon: 'scissors',
    cta: 'Prendre rendez-vous', titreServices: 'Nos prestations',
    description: '{name} vous accueille {a_ville} : coupe, couleur et soins, pour femmes, hommes et enfants, dans une ambiance détendue.',
    atouts: ['Sur rendez-vous ou sans rendez-vous', 'Conseils personnalisés', 'Produits professionnels'],
    services: [
      ['Coupe femme', 'Coupe, shampoing et coiffage adaptés à votre style.'],
      ['Coupe homme & barbe', 'Coupes classiques ou tendance, taille de barbe.'],
      ['Couleur & mèches', 'Coloration, balayage, mèches et patines.'],
      ['Soins & brushing', 'Soins profonds, brushing et coiffures d\'événement.'],
    ],
  },
  fleuriste: {
    famille: 'commerce', activite: 'une boutique de fleurs', photos: 'photos de vos bouquets', schema: 'Florist',
    label: 'Fleuriste', pros: 'des fleuristes', naf: ['47.76Z'],
    palette: { primary: '#BE185D', accent: '#84CC16', dark: '#1F2937', soft: '#FDF2F8' },
    icon: 'flower',
    cta: 'Commander un bouquet', titreServices: 'Nos créations',
    description: '{name}, votre fleuriste {a_ville} : bouquets de saison, compositions sur mesure et plantes, pour toutes les occasions.',
    atouts: ['Fleurs fraîches de saison', 'Compositions sur mesure', 'Commande par téléphone'],
    services: [
      ['Bouquets', 'Bouquets de saison composés à la demande.'],
      ['Mariages & événements', 'Décoration florale de vos cérémonies et réceptions.'],
      ['Deuil', 'Compositions et couronnes, dans le respect et la discrétion.'],
      ['Plantes', 'Plantes d\'intérieur et d\'extérieur, conseils d\'entretien.'],
    ],
  },
  boulangerie: {
    famille: 'commerce', activite: 'une boulangerie', photos: 'photos de vos produits', schema: 'Bakery',
    label: 'Boulangerie-pâtisserie', pros: 'des boulangeries', naf: ['10.71C', '10.71D'],
    palette: { primary: '#92400E', accent: '#FCD34D', dark: '#1C1917', soft: '#FFFBEB' },
    icon: 'bread',
    cta: 'Passer commande', titreServices: 'Nos produits',
    description: '{name}, votre boulangerie {a_ville} : pains, viennoiseries et pâtisseries, préparés chaque jour.',
    atouts: ['Pains et viennoiseries du jour', 'Gâteaux sur commande', 'Commande par téléphone'],
    services: [
      ['Pains', 'Baguettes, pains de campagne et pains spéciaux.'],
      ['Viennoiseries', 'Croissants, pains au chocolat et brioches.'],
      ['Pâtisseries', 'Tartes, entremets et gâteaux de saison.'],
      ['Commandes', 'Gâteaux d\'anniversaire et pièces pour vos événements.'],
    ],
  },
};

// Pictogrammes en SVG inline (aucune image externe à charger).
export const ICONS = {
  brick: '<path d="M3 5h18v4H3zM3 10h8v4H3zM12 10h9v4h-9zM3 15h18v4H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  roof: '<path d="M2 12 12 4l10 8M5 10v10h14V10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  drop: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  window: '<path d="M4 3h16v18H4zM12 3v18M4 12h16" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  brush: '<path d="M14 3l7 7-8 8-4-4zM9 14l-5 5 1 1 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  digger: '<path d="M2 18h12v3H2zM4 18v-5h7l2 5M11 13l5-8 5 4-2 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  crane: '<path d="M6 21V4h2v17M3 21h10M8 5h13M17 5v6M15 11h4v3h-4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  plate: '<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 4v6a2 2 0 0 0 2 2M2.5 4v16M21.5 4c-1.5 1-2 3-2 5v3h2v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  scissors: '<circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 7.5 20 19M8.5 16.5 20 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  flower: '<circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 6.5C12 4 13.5 3 15 3.5c1.5.5 1.5 2.5 0 4M14.5 9c2.5 0 3.5 1.5 3 3s-2.5 1.5-4 0M12 11.5c0 2.5-1.5 3.5-3 3s-1.5-2.5 0-4M9.5 9C7 9 6 7.5 6.5 6S9 4.5 10.5 6M12 11.5V21M12 17c-2-2-4-2-5-1M12 18c2-2 4-2 5-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  bread: '<path d="M4 11a5 5 0 0 1 3-9h10a5 5 0 0 1 3 9v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 9l2 3M13 8l2 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  phone: '<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  check: '<path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  mail: '<path d="M3 5h18v14H3zM3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
};

// Champs utilisés par les emails de prospection, avec les valeurs BTP par défaut.
export function prospection(metier) {
  const m = METIERS[metier] || METIERS.general;
  const commerce = m.famille === 'commerce';
  return {
    pros: m.pros,
    activite: m.activite || 'une entreprise du bâtiment',
    clientele: commerce ? 'des commerces lyonnais' : 'des entreprises du bâtiment',
    photos: m.photos || 'photos de vos chantiers',
    contenu: commerce ? `vos horaires, votre adresse, et un bouton pour ${m.cta.charAt(0).toLowerCase() + m.cta.slice(1)}` : 'vos prestations, votre zone, et un bouton pour vous appeler directement',
  };
}

export function metierFromNaf(naf) {
  for (const [key, m] of Object.entries(METIERS)) if (m.naf.includes(naf)) return key;
  return null;
}
