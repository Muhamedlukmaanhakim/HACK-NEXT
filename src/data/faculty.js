/**
 * Faculty dataset and demo faculty profiles
 * Initial demo faculty: Dr. Aris Thorne (Professor, AI & Robotics Lab)
 */

export const INITIAL_FACULTY = [
  {
    id: 'faculty-1',
    name: 'Dr. Aris Thorne',
    facultyId: 'FAC-8021',
    email: 'aris.thorne@campus.edu',
    department: 'Computer Science (CSE)',
    designation: 'Professor & Lab Director',
    expertise: 'Autonomous Systems & Predictive Healthcare AI',
    researchInterests: ['Healthcare & MedTech', 'AI & Machine Learning', 'Robotics'],
    mentoringAreas: ['Capstone Project Supervision', 'Research Paper Publishing', 'Hackathon Strategy'],
    bio: 'Directing the Campus Intelligent Systems Lab. Mentoring student teams bridging cutting-edge algorithmic theory with clinical and real-world deployment.',
    officeLocation: 'Turing Hall, Room 412',
    officeHours: 'Tuesdays & Thursdays, 3:00 PM – 5:00 PM',
    isDemo: true,
    supervisedProjectIds: ['opp-1', 'opp-3'],
    achievements: [
      'Principal Investigator, National Healthcare Intelligence Grant 2024-2027',
      'Distinguished Faculty Mentorship Award 2025',
    ],
  },
  {
    id: 'faculty-2',
    name: 'Prof. Elena Rostova',
    facultyId: 'FAC-7412',
    email: 'elena.rostova@campus.edu',
    department: 'Design & Media',
    designation: 'Associate Professor',
    expertise: 'Human-Computer Interaction & Design Systems',
    researchInterests: ['Creative Arts & Media', 'EdTech & Learning', 'Social Impact'],
    mentoringAreas: ['UI/UX Product Design', 'User Research Methodologies', 'Pitch Deck Narrative'],
    bio: 'Specializing in accessible interface architectures and multi-sensory computing. Guiding student creators in product design and user empathy.',
    officeLocation: 'Arts & Media Quad, Studio 2B',
    officeHours: 'Mondays & Wednesdays, 2:00 PM – 4:00 PM',
    isDemo: false,
    supervisedProjectIds: ['opp-2'],
    achievements: [
      'Author, "Empathetic Interfaces in Clinical Practice"',
      'Campus Innovation Catalyst Fellow',
    ],
  },
  {
    id: 'faculty-3',
    name: 'Dr. Marcus Vance',
    facultyId: 'FAC-6190',
    email: 'marcus.vance@campus.edu',
    department: 'Information Technology (IT)',
    designation: 'Assistant Professor',
    expertise: 'Distributed Systems & Cloud Security',
    researchInterests: ['FinTech & Web3', 'Cybersecurity', 'Cloud Computing'],
    mentoringAreas: ['Microservice Architecture', 'DevOps & CI/CD', 'Security Audits'],
    bio: 'Researching Byzantine fault-tolerant architectures and edge cryptographic protocols. Enthusiastic advocate for resilient student open-source software.',
    officeLocation: 'Von Neumann Block, Lab 104',
    officeHours: 'Fridays, 10:00 AM – 1:00 PM',
    isDemo: false,
    supervisedProjectIds: ['opp-6'],
    achievements: [
      'Best Systems Paper Award, ACM CloudConf 2024',
    ],
  },
];
