import React, { useState, useEffect } from "react";

const DiscoverPage = () => {
  const [visibleCategories, setVisibleCategories] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [visibleCampaignSections, setVisibleCampaignSections] = useState(3);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  // Mapping des titres vers les IDs des cagnottes en base
  const cagnotteIds = {
    // Cagnottes d'éducation (déjà existantes)
    "Aide Saeb à poursuivre ses études en informatique": "30afa078-48d9-4283-b65c-44f6b1a65182",
    "Bourse d'études pour Nour en médecine": "14f1fb5c-ccdc-4d29-9222-25685b430fbf",
    "Équipement informatique pour l'école rurale": "b29a33a9-2d0c-4fbb-ab27-0ddd9ccf6f58",
    
    // Cagnottes de santé (médicales) - NOUVELLES
    "Aide moi à retrouver une vie digne et pleine d'espoir ❤️": "699950e8-192b-4459-b98a-623a624ab4d3",
    "Aide Julien pour une chirurgie après un accident": "0bd770e5-bf6d-4930-9bbf-1f836d97b08b",
    "Opération du cœur pour Ahmed": "09576dd6-0635-4881-9d2f-18e4c17fe4cf",
    
    // Cagnottes d'urgence - NOUVELLES
    "Aide d'urgence pour les victimes des inondations": "2f0a7dcc-2239-4a4f-8541-fb96a1cf0eee",
    "Secours d'urgence après l'incendie de forêt": "0af8fb2d-2aef-4797-9854-41ffc5dd1f16",
    "Aide d'urgence pour la famille Bouazizi": "907ff6d8-d5f3-4a66-81db-f32ebcccf499",
    
    // Cagnottes sociales - NOUVELLES
    "Soutien à l'association Espoir pour les enfants": "3c45e202-0aa4-449d-b5c2-105f88f966e1",
    "Aide aux familles nécessiteuses de Gafsa": "1fe20eba-18c9-4065-8470-08e164e8944c", // Existe déjà
    "Sauvons l'association Croissant Rouge local": "fc7e919f-9baa-4220-a293-f894af7a1cb1",
    
    // Cagnottes commémoratives - NOUVELLES
    "En mémoire de Fatma - Une vie dédiée à l'éducation": "2ae1408f-9157-463d-9a76-8b1af5bc918e",
    "Mémorial pour les victimes de l'accident": "f7e332d3-f6a0-4cd1-a961-e30872f696a1",
    "Hommage à Mohamed, héros de la révolution": "5eadc7f6-51eb-46af-937d-8d17d21ea16b"
  };
  // Fonction pour obtenir l'icône SVG
  const getCategoryIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      medical: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
          <path d="M12 5L8 21l4-7 4 7-4-16"/>
        </svg>
      ),
      memorials: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      memorial: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      emergencies: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      emergency: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      charity: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      education: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      animals: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="4" r="2"/>
          <circle cx="18" cy="8" r="2"/>
          <circle cx="20" cy="16" r="2"/>
          <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
        </svg>
      ),
      environment: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <path d="M9 9h.01"/>
          <path d="M15 9h.01"/>
        </svg>
      ),
      business: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18"/>
          <path d="M5 21V7l8-4v18"/>
          <path d="M19 21V11l-6-4"/>
        </svg>
      ),
      community: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      trophy: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20.24 14 22"/>
          <path d="M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 10 20.24 10 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
      ),
      creative: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      ),
      events: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      faith: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
      family: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>
          <path d="M3 10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/>
          <path d="M12 8h7a2 2 0 0 1 2 2v1l-2 9"/>
          <path d="M7 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5H7V3z"/>
        </svg>
      ),
      sports: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      ),
      travel: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      volunteer: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
      wishes: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26"/>
        </svg>
      ),
      nonprofit: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      animal: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="4" r="2"/>
          <circle cx="18" cy="8" r="2"/>
          <circle cx="20" cy="16" r="2"/>
          <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
        </svg>
      ),
      environment: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <path d="M9 9h.01"/>
          <path d="M15 9h.01"/>
        </svg>
      ),
      competition: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20.24 14 22"/>
          <path d="M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 10 20.24 10 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
      ),
      event: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    };
    
    return icons[iconName] || icons.charity;
  };

  const categories = [
    {
      name: "Santé",
      icon: "medical",
      href: "/discover/medical-fundraiser",
      trackingId: "discover-category-medical",
    },
    {
      name: "Commémoration",
      icon: "memorials",
      href: "/discover/memorial-fundraiser",
      trackingId: "discover-category-memorial",
    },
    {
      name: "Urgences",
      icon: "emergencies",
      href: "/discover/emergency-fundraiser",
      trackingId: "discover-category-emergency",
    },
    {
      name: "Association à but non lucratif",
      icon: "charity",
      href: "/discover/charity-fundraiser",
      trackingId: "discover-category-nonprofit",
    },
    {
      name: "Éducation",
      icon: "education",
      href: "/discover/education-fundraiser",
      trackingId: "discover-category-education",
    },
    {
      name: "Animaux",
      icon: "animals",
      href: "/discover/animal-fundraiser",
      trackingId: "discover-category-animal",
    },
    {
      name: "Environnement",
      icon: "environment",
      href: "/discover/environment-fundraiser",
      trackingId: "discover-category-environment",
    },
    {
      name: "Entreprises",
      icon: "business",
      href: "/discover/business-fundraiser",
      trackingId: "discover-category-business",
    },
    {
      name: "Communauté",
      icon: "community",
      href: "/discover/community-fundraiser",
      trackingId: "discover-category-community",
    },
    {
      name: "Compétition",
      icon: "trophy",
      href: "/discover/competition-fundraiser",
      trackingId: "discover-category-competition",
    },
    {
      name: "Créativité",
      icon: "creative",
      href: "/discover/creative-fundraiser",
      trackingId: "discover-category-creative",
    },
    {
      name: "Événement",
      icon: "events",
      href: "/discover/event-fundraiser",
      trackingId: "discover-category-event",
    },
    {
      name: "Religion",
      icon: "faith",
      href: "/discover/faith-fundraiser",
      trackingId: "discover-category-faith",
    },
    {
      name: "Famille",
      icon: "family",
      href: "/discover/family-fundraiser",
      trackingId: "discover-category-family",
    },
    {
      name: "Sports",
      icon: "sports",
      href: "/discover/sports-fundraiser",
      trackingId: "discover-category-sports",
    },
    {
      name: "Voyages",
      icon: "travel",
      href: "/discover/travel-fundraiser",
      trackingId: "discover-category-travel",
    },
    {
      name: "Bénévolat",
      icon: "volunteer",
      href: "/discover/volunteer-fundraiser",
      trackingId: "discover-category-volunteer",
    },
    {
      name: "Rêves",
      icon: "wishes",
      href: "/discover/wishes-fundraiser",
      trackingId: "discover-category-wishes",
    },
  ];

  const featuredCampaigns = [
    {
      category: "medical",
      title: "Cagnottes pour des frais médicaux",
      campaigns: [
        {
          title: "Aide moi à retrouver une vie digne et pleine d'espoir ❤️",
          location: "Tunis, Tunisie",
          progress: 82.94,
          amount: "37 321 DT",
          href: `/cagnottes/${cagnotteIds["Aide moi à retrouver une vie digne et pleine d'espoir ❤️"]}`,
          image:
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Aide Julien pour une chirurgie après un accident",
          location: "Sfax, Tunisie",
          progress: 124.08,
          amount: "49 633 DT",
          href: `/cagnottes/${cagnotteIds["Aide Julien pour une chirurgie après un accident"]}`,
          image:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Opération du cœur pour Ahmed",
          location: "Sousse, Tunisie",
          progress: 70.92,
          amount: "15 702 DT",
          href: `/cagnottes/${cagnotteIds["Opération du cœur pour Ahmed"]}`,
          image:
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
    {
      category: "memorial",
      title: "Cagnottes pour une commémoration",
      campaigns: [
        {
          title: "En mémoire de Fatma - Une vie dédiée à l'éducation",
          location: "Monastir, Tunisie",
          progress: 86.37,
          amount: "8 023 DT",
          href: `/cagnottes/${cagnotteIds["En mémoire de Fatma - Une vie dédiée à l'éducation"]}`,
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Mémorial pour les victimes de l'accident",
          location: "Gabès, Tunisie",
          progress: 45.3,
          amount: "12 231 DT",
          href: "/f/memorial-accident-victims",
          image:
            "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Hommage à Mohamed, héros de la révolution",
          location: "Sidi Bouzid, Tunisie",
          progress: 19.1,
          amount: "9 552 DT",
          href: "/f/memorial-mohamed-hero",
          image:
            "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
    {
      category: "emergency",
      title: "Cagnottes en cas d'urgence",
      campaigns: [
        {
          title: "Aide d'urgence pour les victimes des inondations",
          location: "Nabeul, Tunisie",
          progress: 111.01,
          amount: "25 325 DT",
          href: `/cagnottes/${cagnotteIds["Aide d'urgence pour les victimes des inondations"]}`,
          image:
            "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Secours d'urgence après l'incendie de forêt",
          location: "Kasserine, Tunisie",
          progress: 97.33,
          amount: "34 067 DT",
          href: `/cagnottes/${cagnotteIds["Secours d'urgence après l'incendie de forêt"]}`,
          image:
            "https://images.unsplash.com/photo-1574263867128-a3b09ba3c5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Aide d'urgence pour la famille Bouazizi",
          location: "Kairouan, Tunisie",
          progress: 64.41,
          amount: "18 373 DT",
          href: `/cagnottes/${cagnotteIds["Aide d'urgence pour la famille Bouazizi"]}`,
          image:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
    {
      category: "nonprofit",
      title: "Cagnottes pour une association à but non lucratif",
      campaigns: [
        {
          title: "Soutien à l'association Espoir pour les enfants",
          location: "Ariana, Tunisie",
          progress: 22.89,
          amount: "24 398 DT",
          href: `/cagnottes/${cagnotteIds["Soutien à l'association Espoir pour les enfants"]}`,
          image:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Aide aux familles nécessiteuses de Gafsa",
          location: "Gafsa, Tunisie",
          progress: 61.53,
          amount: "84 599 DT",
          href: `/cagnottes/${cagnotteIds["Aide aux familles nécessiteuses de Gafsa"]}`,
          image:
            "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Sauvons l'association Croissant Rouge local",
          location: "Bizerte, Tunisie",
          progress: 39.41,
          amount: "16 314 DT",
          href: `/cagnottes/${cagnotteIds["Sauvons l'association Croissant Rouge local"]}`,
          image:
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
    {
      category: "education",
      title: "Cagnottes scolaires",
      campaigns: [
        {
          title: "Aide Saeb à poursuivre ses études en informatique",
          location: "Tunis, Tunisie",
          progress: 44.05,
          amount: "8 832 DT",
          href: `/cagnottes/${cagnotteIds["Aide Saeb à poursuivre ses études en informatique"]}`,
          image:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Bourse d'études pour Nour en médecine",
          location: "Monastir, Tunisie",
          progress: 96,
          amount: "13 840 DT",
          href: `/cagnottes/${cagnotteIds["Bourse d'études pour Nour en médecine"]}`,
          image:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Équipement informatique pour l'école rurale",
          location: "Sidi Bouzid, Tunisie",
          progress: 32.04,
          amount: "18 010 DT",
          href: `/cagnottes/${cagnotteIds["Équipement informatique pour l'école rurale"]}`,
          image:
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  ];

  // Animation d'entrée
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  // Fonction pour charger plus de catégories
  const loadMoreCategories = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCategories(categories.length);
      setIsLoading(false);
    }, 1500); // Simulation du chargement
  };

  // Fonction pour charger plus de cagnottes
  const loadMoreCampaigns = () => {
    setIsLoadingCampaigns(true);
    setTimeout(() => {
      setVisibleCampaignSections(featuredCampaigns.length);
      setIsLoadingCampaigns(false);
    }, 1500); // Simulation du chargement
  };

  return (
    <main className={`discover-page-layout_page__7xgZ4 ${showAnimation ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-container">
            <div className="hero-text-container slide-up">
              <h1 className="hero-title">
                Découvrez des <span className="highlight-text">cagnottes</span> qui vous inspirent
              </h1>
              <p className="hero-subtitle">
                Soutenez des causes qui vous tiennent à cœur et faites la différence dans votre communauté
              </p>
              <div className="hero-buttons">
                <a
                  className="primary-cta-button"
                  href="/create/fundraiser"
                >
                  <span>Démarrer une cagnotte</span>
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  className="secondary-cta-button"
                  href="#categories"
                >
                  Explorer les catégories
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section">
        <div className="section-container">
          <div className="section-header slide-up">
            <h2 className="section-title">Explorez par catégorie</h2>
            <p className="section-subtitle">Trouvez la cause qui vous passionne</p>
          </div>
          
          <div className="categories-grid">
            {categories.slice(0, visibleCategories).map((category, index) => (
              <div 
                key={category.trackingId} 
                className={`category-card ${showAnimation ? 'slide-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <a
                  className="category-link"
                  data-tracking-id={category.trackingId}
                  href={category.href}
                >
                  <div className="category-icon-container">
                    <div className="category-icon-bg"></div>
                    <div className="category-icon">
                      {getCategoryIcon(category.icon)}
                    </div>
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-arrow">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </a>
              </div>
            ))}
          </div>
          
          {visibleCategories < categories.length && (
            <div className="load-more-section">
              <button
                className={`load-more-button ${isLoading ? 'loading' : ''}`}
                onClick={loadMoreCategories}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>Afficher plus de catégories</span>
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Campaigns Sections */}
      <section className="featured-campaigns-section">
        <div className="section-container">
          {featuredCampaigns.slice(0, visibleCampaignSections).map((section, sectionIndex) => (
            <div key={section.category} className={`campaign-category-section ${showAnimation ? 'slide-up' : ''}`} style={{ animationDelay: `${sectionIndex * 0.2}s` }}>
              <div className="category-section-header">
                <h2 className="category-section-title">{section.title}</h2>
                <div className="category-section-divider"></div>
              </div>
              
              <div className="campaigns-grid">
                {section.campaigns.map((campaign, index) => (
                  <a
                    key={index}
                    className={`campaign-card ${showAnimation ? 'scale-in' : ''}`}
                    style={{ animationDelay: `${(sectionIndex * 3 + index) * 0.1}s` }}
                    href={campaign.href}
                  >
                    <div className="campaign-card-inner">
                      <div className="campaign-image-container">
                        <img
                          alt={campaign.title}
                          className="campaign-image"
                          src={campaign.image}
                        />
                        <div className="campaign-overlay"></div>
                        {campaign.location && (
                          <span className="campaign-location-tag">
                            <svg className="location-icon" viewBox="0 0 24 24" fill="none">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {campaign.location}
                          </span>
                        )}
                      </div>
                      
                      <div className="campaign-content">
                        <h3 className="campaign-title">{campaign.title}</h3>
                        
                        <div className="campaign-progress-container">
                          <div className="progress-bar-bg">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="progress-info">
                            <span className="progress-amount">{campaign.amount} récoltés</span>
                            <span className="progress-percentage">{campaign.progress}%</span>
                          </div>
                        </div>
                        
                        <div className="campaign-cta">
                          <span>Soutenir cette cause</span>
                          <svg className="cta-arrow" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="section-see-more">
                <a
                  className="see-more-link"
                  data-tracking-id={`discover-see-more-${section.category}`}
                  href={`/discover/${section.category}-fundraiser`}
                >
                  <span>En voir plus</span>
                  <svg className="see-more-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
          
          {visibleCampaignSections < featuredCampaigns.length && (
            <div className="load-more-section">
              <button
                className={`load-more-button ${isLoadingCampaigns ? 'loading' : ''}`}
                onClick={loadMoreCampaigns}
                disabled={isLoadingCampaigns}
              >
                {isLoadingCampaigns ? (
                  <>
                    <div className="spinner"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>Afficher plus de cagnottes</span>
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DiscoverPage;