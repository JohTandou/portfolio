import { ExperienceEntry } from "../types";

export const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    id: "talan-sncf",
    company: "TALAN",
    role: "Java/Swing Software Engineer",
    client: "SNCF",
    location: "Paris",
    startDate: "06/2024",
    endDate: null,
    status: "active",
    mission:
      "Conception et déploiement d'une application desktop de gestion RH/matériel pour le fret ferroviaire SNCF.",
    impact: [
      "10+ écrans implémentés en Java/Swing",
      "Validateurs et modèles fiabilisés",
      "Export Excel optimisé pour le service RH",
      "Scripts SQL et tests JUnit",
      "Recette, mise en production et support utilisateur",
    ],
    stack: ["Java", "Swing", "SQL", "JUnit", "Maven"],
  },
  {
    id: "talan-rd",
    company: "TALAN",
    role: "Angular Software Engineer",
    client: "R&D",
    location: "Paris",
    startDate: "04/2024",
    endDate: "06/2024",
    status: "completed",
    mission:
      "Participation à un projet de recherche et développement interne.",
    impact: [
      "Développement de 7 filtres avancés en Angular",
      "Intégration d'API REST",
      "Optimisation de l'export Excel/CSV pour 1M+ lignes",
    ],
    stack: ["Angular", "TypeScript", "REST API"],
  },
  {
    id: "hardis-react",
    company: "HARDIS GROUP",
    role: "Full-Stack Engineer (Internship)",
    client: "Plateforme interne",
    location: "Paris",
    startDate: "04/2023",
    endDate: "09/2023",
    status: "internship",
    mission:
      "Développement d'une application web de suivi managérial avec React et Python.",
    impact: [
      "7 pages interactives et modales de détail",
      "Notifications push en temps réel",
      "Authentification Firebase Auth",
      "API REST en Python/FastAPI + tests Pytest",
      "Déploiement et support direct de 20 utilisateurs finaux",
    ],
    stack: ["React", "JavaScript", "Python", "FastAPI", "Firebase"],
  },
  {
    id: "hardis-java",
    company: "HARDIS GROUP",
    role: "Java Developer (Internship)",
    client: "Application terrain",
    location: "Paris",
    startDate: "12/2021",
    endDate: "04/2022",
    status: "internship",
    mission:
      "Développement d'une application mobile de planification de travaux d'isolation et de chauffage.",
    impact: [
      "Filtrage intelligent des interventions : temps réduit de 50%",
      "Tests de charge et robustesse en conditions dégradées",
      "64 tests JUnit automatisés, couverture +7%",
    ],
    stack: ["Java", "JUnit", "Android"],
  },
  {
    id: "digit-xamarin",
    company: "DIGIT-R",
    role: "Xamarin Developer (Internship)",
    client: "Application VTC",
    location: "Paris",
    startDate: "06/2021",
    endDate: "08/2021",
    status: "internship",
    mission:
      "Développement d'une application mobile pour chauffeurs VTC.",
    impact: [
      "6 écrans développés en Xamarin.Forms avec MVVM",
      "Notifications push pour alertes de course",
      "Géolocalisation temps réel avec cartes interactives",
      "Participation aux daily scrums en équipe agile",
    ],
    stack: ["Xamarin", "C#", "XAML", "MVVM", "SQL Server"],
  },
];
