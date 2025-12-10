export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  icon: string;
  author?: string;
  tags?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 conseils pour réussir votre cagnotte",
    excerpt: "Découvrez les stratégies éprouvées pour maximiser vos collectes de fonds et atteindre vos objectifs plus rapidement.",
    content: `
      <h2>Introduction</h2>
      <p>Créer une cagnotte réussie nécessite plus qu'une simple page de collecte. Voici 10 conseils essentiels pour maximiser vos chances de succès.</p>
      
      <h2>1. Racontez une histoire authentique</h2>
      <p>Les donateurs se connectent aux histoires personnelles. Partagez votre parcours, vos défis et vos espoirs de manière sincère et émotionnelle. Une histoire bien racontée peut transformer un simple appel en un mouvement de solidarité.</p>
      
      <h2>2. Fixez un objectif réaliste</h2>
      <p>Un objectif trop élevé peut décourager les donateurs, tandis qu'un objectif trop bas peut sembler peu ambitieux. Analysez vos besoins réels et fixez un montant atteignable qui vous permettra d'accomplir votre projet.</p>
      
      <h2>3. Utilisez des visuels de qualité</h2>
      <p>Une image vaut mille mots. Ajoutez des photos ou vidéos de qualité qui illustrent votre cause. Les visuels émotionnels augmentent significativement l'engagement des visiteurs.</p>
      
      <h2>4. Partagez régulièrement</h2>
      <p>La visibilité est clé. Partagez votre cagnotte sur les réseaux sociaux, par email, et demandez à vos proches de la partager. Un partage régulier maintient votre cause dans l'esprit des gens.</p>
      
      <h2>5. Remerciez vos donateurs</h2>
      <p>Chaque don mérite une reconnaissance. Remerciez publiquement et personnellement vos donateurs. Cela renforce la confiance et encourage d'autres contributions.</p>
      
      <h2>6. Mettez à jour régulièrement</h2>
      <p>Gardez vos supporters informés de l'avancement. Partagez les progrès, les défis rencontrés et les succès. La transparence renforce la confiance.</p>
      
      <h2>7. Créez un sentiment d'urgence</h2>
      <p>Une date limite claire encourage l'action immédiate. Communiquez l'importance de la contribution maintenant plutôt que plus tard.</p>
      
      <h2>8. Expliquez l'utilisation des fonds</h2>
      <p>Les donateurs veulent savoir où va leur argent. Détaillez comment chaque dinar sera utilisé. La transparence financière est essentielle.</p>
      
      <h2>9. Engagez votre communauté</h2>
      <p>Créez un sentiment de communauté autour de votre cause. Répondez aux commentaires, organisez des événements, créez du contenu engageant.</p>
      
      <h2>10. Restez positif et persévérant</h2>
      <p>La collecte de fonds peut être un marathon. Restez positif, persévérez et célébrez chaque étape franchie, même les plus petites.</p>
      
      <h2>Conclusion</h2>
      <p>En suivant ces conseils, vous maximisez vos chances de créer une cagnotte réussie qui rassemble votre communauté autour de votre cause.</p>
    `,
    category: "Conseils",
    date: "15 Mars 2024",
    readTime: "5 min",
    icon: "💡",
    author: "Équipe Kollecta",
    tags: ["Conseils", "Stratégie", "Débutant"]
  },
  {
    id: 2,
    title: "Comment raconter votre histoire",
    excerpt: "L'art de créer une connexion émotionnelle avec vos donateurs à travers un récit authentique et touchant.",
    content: `
      <h2>Le pouvoir du storytelling</h2>
      <p>Une histoire bien racontée peut transformer une simple demande de don en un mouvement de solidarité. Voici comment créer une connexion émotionnelle avec vos donateurs.</p>
      
      <h2>Commencer par le pourquoi</h2>
      <p>Avant de parler du "quoi" et du "comment", expliquez le "pourquoi". Pourquoi cette cause vous tient-elle à cœur ? Quel est le problème que vous résolvez ?</p>
      
      <h2>Utilisez la structure narrative classique</h2>
      <p>Une bonne histoire suit une structure : situation initiale, élément déclencheur, développement, résolution. Appliquez cette structure à votre récit pour créer un arc narratif captivant.</p>
      
      <h2>Soyez authentique</h2>
      <p>L'authenticité est plus importante que la perfection. Partagez vos vraies émotions, vos doutes, vos espoirs. Les gens se connectent à la vulnérabilité authentique.</p>
      
      <h2>Montrez, ne dites pas</h2>
      <p>Au lieu de dire "c'est difficile", montrez les défis à travers des exemples concrets. Utilisez des anecdotes, des détails spécifiques qui rendent votre histoire vivante.</p>
      
      <h2>Créez un héros</h2>
      <p>Dans votre histoire, qui est le héros ? C'est peut-être la personne qui bénéficiera de la collecte, ou votre communauté qui se mobilise. Identifiez et mettez en avant ce héros.</p>
      
      <h2>Utilisez des détails sensoriels</h2>
      <p>Faites appel aux sens de vos lecteurs. Décrivez ce qu'on voit, entend, ressent. Ces détails rendent l'histoire immersive et mémorable.</p>
      
      <h2>Concluez avec un appel à l'action clair</h2>
      <p>Terminez votre histoire par un appel à l'action qui invite naturellement à contribuer. Reliez l'action à l'émotion que vous avez créée.</p>
    `,
    category: "Guide",
    date: "10 Mars 2024",
    readTime: "7 min",
    icon: "📖",
    author: "Équipe Kollecta",
    tags: ["Storytelling", "Communication", "Guide"]
  },
  {
    id: 3,
    title: "Les réseaux sociaux au service de votre cause",
    excerpt: "Stratégies de partage et bonnes pratiques pour maximiser la portée de votre cagnotte sur les réseaux sociaux.",
    content: `
      <h2>Maximiser votre portée sur les réseaux sociaux</h2>
      <p>Les réseaux sociaux sont un outil puissant pour faire connaître votre cagnotte. Voici comment les utiliser efficacement.</p>
      
      <h2>Choisir les bonnes plateformes</h2>
      <p>Chaque réseau social a son public. Facebook pour les communautés locales, Instagram pour les visuels, Twitter pour les actualités, LinkedIn pour le professionnel. Adaptez votre contenu à chaque plateforme.</p>
      
      <h2>Créer du contenu visuel</h2>
      <p>Les posts avec images ou vidéos ont un taux d'engagement bien supérieur. Créez des visuels attrayants qui racontent votre histoire en un coup d'œil.</p>
      
      <h2>Utiliser les hashtags stratégiquement</h2>
      <p>Les hashtags augmentent la visibilité. Utilisez des hashtags pertinents, mixtes (généraux et spécifiques), et créez un hashtag unique pour votre cause.</p>
      
      <h2>Publier régulièrement</h2>
      <p>La régularité maintient votre cause visible. Créez un calendrier de publication avec des mises à jour, des remerciements, des témoignages.</p>
      
      <h2>Engager avec votre communauté</h2>
      <p>Répondez aux commentaires, remerciez les partages, créez du dialogue. L'engagement renforce la communauté autour de votre cause.</p>
      
      <h2>Collaborer avec des influenceurs</h2>
      <p>Les micro-influenceurs locaux peuvent avoir un impact significatif. Contactez-les avec une proposition claire et authentique.</p>
      
      <h2>Mesurer et ajuster</h2>
      <p>Analysez quels types de posts fonctionnent le mieux et ajustez votre stratégie en conséquence. Les données guident l'amélioration.</p>
    `,
    category: "Marketing",
    date: "5 Mars 2024",
    readTime: "6 min",
    icon: "📱",
    author: "Équipe Kollecta",
    tags: ["Marketing", "Réseaux sociaux", "Stratégie"]
  },
  {
    id: 4,
    title: "Organiser un événement de collecte réussi",
    excerpt: "Du brainstorming à la réalisation : toutes les étapes pour organiser un événement de collecte mémorable.",
    content: `
      <h2>Organiser un événement de collecte réussi</h2>
      <p>Un événement peut donner un élan significatif à votre collecte. Voici comment organiser un événement mémorable.</p>
      
      <h2>Définir l'objectif de l'événement</h2>
      <p>Quel est le but principal ? Collecter des fonds, sensibiliser, créer de la communauté ? Un objectif clair guide toutes les décisions.</p>
      
      <h2>Choisir le bon format</h2>
      <p>Défis sportifs, concerts, ventes, webinaires... Le format doit correspondre à votre cause et à votre public cible.</p>
      
      <h2>Planifier en amont</h2>
      <p>Un événement réussi nécessite une planification minutieuse. Commencez au moins 6-8 semaines à l'avance pour avoir le temps de tout organiser.</p>
      
      <h2>Créer un budget réaliste</h2>
      <p>Estimez tous les coûts (lieu, matériel, communication) et assurez-vous que l'événement générera plus qu'il ne coûte.</p>
      
      <h2>Mobiliser une équipe</h2>
      <p>Vous ne pouvez pas tout faire seul. Formez une équipe de bénévoles avec des rôles clairs : logistique, communication, animation.</p>
      
      <h2>Promouvoir activement</h2>
      <p>Utilisez tous les canaux : réseaux sociaux, email, bouche-à-oreille, médias locaux. La promotion est cruciale pour le succès.</p>
      
      <h2>Créer une expérience mémorable</h2>
      <p>Un événement réussi est une expérience. Pensez à l'ambiance, aux interactions, aux moments forts qui marqueront les participants.</p>
      
      <h2>Suivre et remercier</h2>
      <p>Après l'événement, partagez les résultats, remerciez tous les participants et maintenez l'élan pour continuer la collecte.</p>
    `,
    category: "Événements",
    date: "1 Mars 2024",
    readTime: "8 min",
    icon: "🎉",
    author: "Équipe Kollecta",
    tags: ["Événements", "Organisation", "Guide"]
  },
  {
    id: 5,
    title: "La transparence, clé de la confiance",
    excerpt: "Pourquoi et comment communiquer de manière transparente avec vos donateurs pour renforcer leur confiance.",
    content: `
      <h2>La transparence comme fondation de la confiance</h2>
      <p>La transparence est essentielle pour créer et maintenir la confiance avec vos donateurs. Voici comment la mettre en pratique.</p>
      
      <h2>Pourquoi la transparence est cruciale</h2>
      <p>Les donateurs veulent savoir où va leur argent. La transparence renforce la confiance, encourage les dons répétés et crée une communauté engagée.</p>
      
      <h2>Communiquer l'utilisation des fonds</h2>
      <p>Détaillez précisément comment chaque dinar sera utilisé. Créez un budget transparent avec des postes de dépenses clairs et vérifiables.</p>
      
      <h2>Partager les progrès régulièrement</h2>
      <p>Mettez à jour régulièrement vos supporters sur l'avancement. Montrez les étapes franchies, les défis rencontrés, les succès obtenus.</p>
      
      <h2>Être honnête sur les défis</h2>
      <p>La transparence inclut aussi les difficultés. Être honnête sur les défis renforce la crédibilité et peut même mobiliser davantage de soutien.</p>
      
      <h2>Rendre des comptes</h2>
      <p>Après la collecte, partagez un rapport détaillé de l'utilisation des fonds. Montrez l'impact concret de chaque contribution.</p>
      
      <h2>Répondre aux questions</h2>
      <p>Soyez accessible et répondez aux questions des donateurs. La communication ouverte renforce la relation de confiance.</p>
      
      <h2>Utiliser des outils de transparence</h2>
      <p>Les reçus, les rapports, les photos de progrès sont autant d'outils qui matérialisent la transparence et rassurent les donateurs.</p>
    `,
    category: "Communication",
    date: "25 Février 2024",
    readTime: "5 min",
    icon: "🤝",
    author: "Équipe Kollecta",
    tags: ["Transparence", "Confiance", "Communication"]
  },
  {
    id: 6,
    title: "Témoignages inspirants de collectes réussies",
    excerpt: "Découvrez les histoires de personnes qui ont transformé leur vie grâce à la générosité de la communauté Kollecta.",
    content: `
      <h2>Des histoires qui inspirent</h2>
      <p>Découvrez comment des personnes ordinaires ont accompli des choses extraordinaires grâce à la solidarité de la communauté Kollecta.</p>
      
      <h2>L'histoire de Sarah : Un nouveau départ</h2>
      <p>Sarah, une jeune entrepreneure, a réussi à collecter 50 000 DT pour lancer son projet de boulangerie solidaire. Sa transparence et sa passion ont mobilisé toute sa communauté.</p>
      
      <h2>Le projet communautaire de Ahmed</h2>
      <p>Ahmed a organisé une collecte pour créer un espace vert dans son quartier. En impliquant les voisins dès le début, il a dépassé son objectif de 200%.</p>
      
      <h2>La solidarité médicale de Fatma</h2>
      <p>Face à des frais médicaux urgents, Fatma a reçu un soutien massif. L'histoire émouvante de sa famille a touché des centaines de personnes.</p>
      
      <h2>Leçons apprises</h2>
      <p>Ces histoires montrent l'importance de l'authenticité, de la transparence et de l'engagement communautaire dans le succès d'une collecte.</p>
      
      <h2>Vous pouvez aussi réussir</h2>
      <p>Chaque histoire de succès a commencé par un premier pas. Avec la bonne approche et la détermination, votre projet peut aussi voir le jour.</p>
    `,
    category: "Inspiration",
    date: "20 Février 2024",
    readTime: "10 min",
    icon: "⭐",
    author: "Équipe Kollecta",
    tags: ["Inspiration", "Succès", "Témoignages"]
  }
];

export const getBlogPostById = (id: number): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  if (category === "Tous") return blogPosts;
  return blogPosts.filter(post => post.category === category);
};


