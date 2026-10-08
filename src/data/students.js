/**
 * Rich mock students database (16+ students, technical and non-technical)
 */

export const INITIAL_STUDENTS = [
  {
    id: 'student-1',
    name: 'Lukmaan Hakim',
    email: 'lukmaan.hakim@campus.edu',
    department: 'Computer Science (CSE)',
    year: '2nd Year',
    bio: 'AI researcher and systems developer passionate about building predictive diagnostics and intelligent healthcare pipelines.',
    skills: ['Python', 'AI/ML', 'C/C++', 'Backend', 'Data Science'],
    interests: ['AI & Machine Learning', 'Healthcare & MedTech', 'Hardware & IoT'],
    availability: ['Weekends', 'Evenings'],
    proficiency: {
      'Python': 5,
      'AI/ML': 4,
      'C/C++': 4,
      'Backend': 4,
      'Data Science': 4,
    },
    projects: [
      { name: 'CardioVision AI', desc: 'Real-time ECG arrhythmia classification using convolutional networks.' },
      { name: 'NeuralCache', desc: 'In-memory caching engine written in C++ with LRU eviction.' }
    ],
    achievements: [
      'Top 5 Finalist, National Healthcare AI Hackathon 2025',
      'Dean’s Honors List, Semester 1 & 2'
    ],
    matchScore: 98,
  },
  {
    id: 'student-2',
    name: 'Sarah Rahman',
    email: 'sarah.rahman@campus.edu',
    department: 'Design & Media',
    year: '3rd Year',
    bio: 'Product designer focusing on accessible user interfaces, empathetic design systems, and engaging demo presentations.',
    skills: ['UI/UX', 'Figma', 'Graphic Design', 'Presentation', 'Storytelling'],
    interests: ['Creative Arts & Media', 'Healthcare & MedTech', 'EdTech & Learning'],
    availability: ['Weekends', 'Flexible'],
    proficiency: {
      'UI/UX': 5,
      'Figma': 5,
      'Graphic Design': 4,
      'Presentation': 5,
      'Storytelling': 4,
    },
    projects: [
      { name: 'Aura Health UI', desc: 'Full Figma design system and clinical dashboard prototype.' },
      { name: 'CampusConnect', desc: 'Mobile app onboarding experience redesign.' }
    ],
    achievements: [
      '1st Place, University Designathon 2025',
      'Adobe Certified Professional in Visual Design'
    ],
    matchScore: 94,
  },
  {
    id: 'student-3',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@campus.edu',
    department: 'Computer Science (CSE)',
    year: '3rd Year',
    bio: 'Cloud and distributed systems engineer. Love architecting reliable REST and GraphQL endpoints that scale cleanly.',
    skills: ['Backend', 'APIs', 'Databases', 'AI/ML', 'Cloud'],
    interests: ['Healthcare & MedTech', 'AI & Machine Learning', 'FinTech & Web3'],
    availability: ['Weekends', 'Weekdays'],
    proficiency: {
      'Backend': 5,
      'APIs': 5,
      'Databases': 4,
      'Cloud': 4,
      'AI/ML': 3,
    },
    projects: [
      { name: 'MedFast API Gateway', desc: 'Low-latency microservices cluster handling patient record queries.' },
      { name: 'SQLOptimize', desc: 'Automated indexing query tuner for PostgreSQL databases.' }
    ],
    achievements: [
      'AWS Certified Solutions Architect Associate',
      'Hackathon Best Backend Architecture Award'
    ],
    matchScore: 91,
  },
  {
    id: 'student-4',
    name: 'Aisha Khan',
    email: 'aisha.khan@campus.edu',
    department: 'Business Administration (BBA)',
    year: '2nd Year',
    bio: 'Growth strategist and marketer passionate about turning technical inventions into viral campus products.',
    skills: ['Marketing', 'Social Media', 'Branding', 'Content/Script Writing', 'Growth Strategy'],
    interests: ['Campus Culture & Events', 'Social Impact & Non-Profit', 'EdTech & Learning'],
    availability: ['Evenings', 'Flexible'],
    proficiency: {
      'Marketing': 5,
      'Social Media': 5,
      'Branding': 4,
      'Content/Script Writing': 4,
      'Growth Strategy': 4,
    },
    projects: [
      { name: 'Campus Launchpad', desc: 'Grew campus startup newsletter to 3,500 active weekly subscribers.' },
      { name: 'EcoHack Campaign', desc: 'Managed outreach bringing 400+ participants from 12 universities.' }
    ],
    achievements: [
      'Lead Organizer, E-Summit 2025',
      'Winner, Inter-College Pitch Deck Competition'
    ],
    matchScore: 89,
  },
  {
    id: 'student-5',
    name: 'Arjun Verma',
    email: 'arjun.verma@campus.edu',
    department: 'Information Technology (IT)',
    year: '2nd Year',
    bio: 'Frontend enthusiast crafting performant, responsive web applications with modern React ecosystems.',
    skills: ['React', 'JavaScript', 'Frontend Development', 'App Dev', 'UI/UX'],
    interests: ['AI & Machine Learning', 'Gaming & Interactive Media', 'EdTech & Learning'],
    availability: ['Weekdays', 'Flexible'],
    proficiency: {
      'React': 5,
      'JavaScript': 5,
      'Frontend Development': 5,
      'App Dev': 3,
      'UI/UX': 3,
    },
    projects: [
      { name: 'CodeLive Editor', desc: 'Collaborative browser-based markdown and live preview scratchpad.' },
      { name: 'Campus Timetable App', desc: 'Clean daily planner used by 800+ engineering students.' }
    ],
    achievements: [
      'Top Contributor, College Open Source Club',
      'HackX Best Web Implementation 2025'
    ],
    matchScore: 84,
  },
  {
    id: 'student-6',
    name: 'Meera Nair',
    email: 'meera.nair@campus.edu',
    department: 'Business Administration (BBA)',
    year: '3rd Year',
    bio: 'Keynote orator and collegiate debater who excels at synthesizing complex technical ideas into captivating stage pitches.',
    skills: ['Public Speaking', 'Storytelling', 'Leadership', 'Presentation', 'Technical Writing'],
    interests: ['Healthcare & MedTech', 'Campus Culture & Events', 'Social Impact & Non-Profit'],
    availability: ['Weekends', 'Evenings'],
    proficiency: {
      'Public Speaking': 5,
      'Presentation': 5,
      'Storytelling': 5,
      'Leadership': 4,
      'Technical Writing': 4,
    },
    projects: [
      { name: 'TEDx Campus Organizer', desc: 'Host and curator for annual university intellectual speaker series.' },
      { name: 'Impact Pitch Lab', desc: 'Mentored 15 student teams on delivering 3-minute investor pitches.' }
    ],
    achievements: [
      'National Parliamentary Debate Champion 2024',
      'Best Delegate, University Model United Nations'
    ],
    matchScore: 88,
  },
  {
    id: 'student-7',
    name: 'Vikram Patel',
    email: 'vikram.patel@campus.edu',
    department: 'Electronics & Comm (ECE)',
    year: '3rd Year',
    bio: 'Cybersecurity researcher interested in network intrusion detection, embedded hardware integrity, and cloud hardening.',
    skills: ['Cybersecurity', 'Cloud', 'IoT', 'Python', 'C/C++'],
    interests: ['Hardware & IoT', 'FinTech & Web3', 'AI & Machine Learning'],
    availability: ['Weekdays', 'Weekends'],
    proficiency: {
      'Cybersecurity': 5,
      'Cloud': 4,
      'IoT': 4,
      'Python': 4,
      'C/C++': 3,
    },
    projects: [
      { name: 'SentinelIoT', desc: 'Lightweight anomaly detection agent for microcontroller fleets.' },
      { name: 'PenTest Toolkit', desc: 'Open-source wireless packet scanner.' }
    ],
    achievements: [
      'Rank 14, Regional Capture The Flag (CTF) Cyber Challenge',
      'CompTIA Security+ Certified'
    ],
    matchScore: 82,
  },
  {
    id: 'student-8',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@campus.edu',
    department: 'Biotechnology',
    year: '3rd Year',
    bio: 'Bioinformatics student combining computational analysis with clinical genomics to discover drug targets.',
    skills: ['Research', 'Data Analysis', 'Academic Writing', 'Python', 'Literature Review'],
    interests: ['Healthcare & MedTech', 'Climate & Sustainability', 'AI & Machine Learning'],
    availability: ['Flexible', 'Weekdays'],
    proficiency: {
      'Research': 5,
      'Data Analysis': 5,
      'Academic Writing': 4,
      'Literature Review': 5,
      'Python': 3,
    },
    projects: [
      { name: 'GeneClust', desc: 'Phylogenetic clustering algorithm for bacterial protein families.' },
      { name: 'BioLiterature Mining', desc: 'Automated PubMed article synthesis pipeline.' }
    ],
    achievements: [
      'Published Co-Author, Journal of Computational Biology 2025',
      'Undergraduate Research Grant Awardee'
    ],
    matchScore: 80,
  },
  {
    id: 'student-9',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@campus.edu',
    department: 'Mechanical Engineering',
    year: '4th Year',
    bio: 'Robotics and mechatronics builder obsessed with autonomous rover navigation, PID control, and motor telemetry.',
    skills: ['Robotics', 'C/C++', 'IoT', 'Python', 'Team Management'],
    interests: ['Hardware & IoT', 'AI & Machine Learning', 'Climate & Sustainability'],
    availability: ['Weekends', 'Full-time Sprint'],
    proficiency: {
      'Robotics': 5,
      'C/C++': 5,
      'IoT': 4,
      'Python': 3,
      'Team Management': 4,
    },
    projects: [
      { name: 'AeroRover X4', desc: 'Semi-autonomous search-and-rescue rover with obstacle avoidance.' },
      { name: 'Smart Actuator Hub', desc: 'CAN bus motor controller firmware.' }
    ],
    achievements: [
      'Captain, University Robotics Team (RoboCon 2025)',
      '1st Place, National Mechatronics Design Challenge'
    ],
    matchScore: 78,
  },
  {
    id: 'student-10',
    name: 'Priya Das',
    email: 'priya.das@campus.edu',
    department: 'Design & Media',
    year: '2nd Year',
    bio: 'Visual storyteller and video editor specializing in product launch teasers, 3D kinetic typography, and motion design.',
    skills: ['Video Editing', 'Videography', 'Motion Graphics', 'Graphic Design', 'Branding'],
    interests: ['Creative Arts & Media', 'Campus Culture & Events', 'Gaming & Interactive Media'],
    availability: ['Evenings', 'Flexible'],
    proficiency: {
      'Video Editing': 5,
      'Motion Graphics': 4,
      'Videography': 4,
      'Graphic Design': 4,
      'Branding': 3,
    },
    projects: [
      { name: 'TechFest Official Aftermovie', desc: '4K highlight recap with 25,000+ views on YouTube.' },
      { name: 'SaaS Explainer Animations', desc: 'Vector kinetic explainers for student startup pitches.' }
    ],
    achievements: [
      'Best Cinematography, Inter-University Film Fest',
      'Certified DaVinci Resolve Colorist'
    ],
    matchScore: 85,
  },
  {
    id: 'student-11',
    name: 'Devika Menon',
    email: 'devika.menon@campus.edu',
    department: 'Design & Media',
    year: '3rd Year',
    bio: '3D environment artist and immersive interface designer creating interactive web 3D experiences using Blender & Spline.',
    skills: ['3D Design', 'Animation', 'Figma', 'UI/UX', 'Graphic Design'],
    interests: ['Creative Arts & Media', 'Gaming & Interactive Media', 'EdTech & Learning'],
    availability: ['Weekends', 'Evenings'],
    proficiency: {
      '3D Design': 5,
      'Animation': 4,
      'Figma': 4,
      'UI/UX': 3,
      'Graphic Design': 4,
    },
    projects: [
      { name: 'Campus Metaverse Map', desc: 'Interactive 3D low-poly campus walkthrough in WebGL.' },
      { name: 'HoloMedical 3D', desc: 'Anatomical organ models for AR surgery training mockups.' }
    ],
    achievements: [
      'Featured Artist on Behance 3D Showcase',
      'Excellence in Interactive Media Award'
    ],
    matchScore: 81,
  },
  {
    id: 'student-12',
    name: 'Kabir Singh',
    email: 'kabir.singh@campus.edu',
    department: 'Business Administration (BBA)',
    year: '3rd Year',
    bio: 'Product manager and venture builder skilled at roadmapping MVPs, validating customer willingness-to-pay, and unit economics.',
    skills: ['Entrepreneurship', 'Product Management', 'Leadership', 'Marketing', 'Team Management'],
    interests: ['FinTech & Web3', 'Healthcare & MedTech', 'Campus Culture & Events'],
    availability: ['Flexible', 'Weekdays'],
    proficiency: {
      'Entrepreneurship': 5,
      'Product Management': 4,
      'Leadership': 4,
      'Marketing': 4,
      'Team Management': 4,
    },
    projects: [
      { name: 'DormDelivery', desc: 'Campus late-night micro-logistics platform piloting in 4 hostels.' },
      { name: 'FinEd Youth', desc: 'Financial literacy gamified workshop reaching 1,200 freshmen.' }
    ],
    achievements: [
      'President, University E-Cell',
      'Seed Grant Winner, Student Venture Fund ($2,500)'
    ],
    matchScore: 83,
  },
  {
    id: 'student-13',
    name: 'Neha Gupta',
    email: 'neha.gupta@campus.edu',
    department: 'Business Administration (BBA)',
    year: '2nd Year',
    bio: 'Experiential event producer and social campaign manager skilled at building high-energy campus communities.',
    skills: ['Event Management', 'Social Media', 'Public Speaking', 'Branding', 'Project Coordination'],
    interests: ['Campus Culture & Events', 'Social Impact & Non-Profit', 'Creative Arts & Media'],
    availability: ['Weekends', 'Evenings'],
    proficiency: {
      'Event Management': 5,
      'Social Media': 4,
      'Public Speaking': 4,
      'Branding': 3,
      'Project Coordination': 4,
    },
    projects: [
      { name: 'HackCampus Gala', desc: 'Coordinated logistics, sponsor booths, and catering for 600 attendees.' },
      { name: 'Campus Pulse Radio', desc: 'Weekly podcast profiling university student innovators.' }
    ],
    achievements: [
      'Secretary, Student Cultural Committee',
      'Social Media Director, Annual College Fest'
    ],
    matchScore: 79,
  },
  {
    id: 'student-14',
    name: 'Tanmay Joshi',
    email: 'tanmay.joshi@campus.edu',
    department: 'Information Technology (IT)',
    year: '2nd Year',
    bio: 'Cross-platform app engineer building responsive, offline-first mobile applications with clean state management.',
    skills: ['App Dev', 'React', 'JavaScript', 'Cloud', 'APIs'],
    interests: ['EdTech & Learning', 'AI & Machine Learning', 'FinTech & Web3'],
    availability: ['Weekdays', 'Weekends'],
    proficiency: {
      'App Dev': 5,
      'React': 4,
      'JavaScript': 4,
      'Cloud': 3,
      'APIs': 4,
    },
    projects: [
      { name: 'CampusTransit Live', desc: 'Real-time GPS bus tracking app for college commuters.' },
      { name: 'QuizMaster Pro', desc: 'Gamified quiz buzzer app for inter-branch competitions.' }
    ],
    achievements: [
      'App Store feature under University Utilities',
      'HackTheNorth Participant'
    ],
    matchScore: 82,
  },
  {
    id: 'student-15',
    name: 'Shreya Iyer',
    email: 'shreya.iyer@campus.edu',
    department: 'AI & Data Science (AI&DS)',
    year: '4th Year',
    bio: 'Technical author and NLP specialist focused on scientific literature parsing, prompt engineering, and model documentation.',
    skills: ['Technical Writing', 'Documentation', 'Python', 'Research', 'AI/ML'],
    interests: ['AI & Machine Learning', 'EdTech & Learning', 'Healthcare & MedTech'],
    availability: ['Flexible', 'Weekdays'],
    proficiency: {
      'Technical Writing': 5,
      'Documentation': 5,
      'Python': 4,
      'Research': 4,
      'AI/ML': 4,
    },
    projects: [
      { name: 'MLOps Handbook', desc: 'Comprehensive open-source documentation for deploying PyTorch models.' },
      { name: 'arXiv Summarizer Bot', desc: 'Daily automated digest of top preprint papers in computer vision.' }
    ],
    achievements: [
      'Google Season of Docs 2024 Contributor',
      'IEEE Student Paper Award Finalist'
    ],
    matchScore: 86,
  },
  {
    id: 'student-16',
    name: 'Siddharth Roy',
    email: 'siddharth.roy@campus.edu',
    department: 'Computer Science (CSE)',
    year: '1st Year',
    bio: 'Eager first-year coder passionate about full stack architectures, databases, and shipping clean software fast.',
    skills: ['JavaScript', 'Databases', 'APIs', 'React', 'Frontend Development'],
    interests: ['Gaming & Interactive Media', 'AI & Machine Learning', 'FinTech & Web3'],
    availability: ['Evenings', 'Weekends'],
    proficiency: {
      'JavaScript': 4,
      'Databases': 3,
      'APIs': 3,
      'React': 3,
      'Frontend Development': 3,
    },
    projects: [
      { name: 'StudyBuddy Room', desc: 'WebRTC video and shared Pomodoro timer for study sessions.' },
      { name: 'CLI Task Tracker', desc: 'Minimalist command-line task manager written in Node.js.' }
    ],
    achievements: [
      '1st Place, Freshers Hackathon 2025',
      'LeetCode 200+ problems solved'
    ],
    matchScore: 76,
  },
];
