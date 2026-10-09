/**
 * Evidence-Based Skill Integrity & Practical Assessments
 * Statuses:
 * - SELF_DECLARED
 * - EVIDENCE_SUBMITTED
 * - PRACTICALLY_DEMONSTRATED
 * - INDEPENDENTLY_REVIEWED
 */

export const SKILL_STATUSES = {
  SELF_DECLARED: 'SELF_DECLARED',
  EVIDENCE_SUBMITTED: 'EVIDENCE_SUBMITTED',
  PRACTICALLY_DEMONSTRATED: 'PRACTICALLY_DEMONSTRATED',
  INDEPENDENTLY_REVIEWED: 'INDEPENDENTLY_REVIEWED',
};

export const SKILL_EVIDENCE_STATUS = SKILL_STATUSES;

export const EVIDENCE_WEIGHT_MULTIPLIERS = {
  SELF_DECLARED: 0.6,
  EVIDENCE_SUBMITTED: 0.8,
  PRACTICALLY_DEMONSTRATED: 0.95,
  INDEPENDENTLY_REVIEWED: 1.0,
};

export const INITIAL_SKILL_EVIDENCE = [
  {
    id: 'ev-1',
    studentId: 'student-1',
    studentName: 'Lukmaan Hakim',
    skill: 'Python',
    status: SKILL_STATUSES.INDEPENDENTLY_REVIEWED,
    evidenceType: 'Practical Assessment & GitHub Repository',
    evidenceUrl: 'https://github.com/lukmaan-hakim/cardiovision-engine',
    submissionDate: '2026-09-28',
    description: 'Developed convolutional neural network in PyTorch for real-time arrhythmia classification with custom data pipelines.',
    assessmentResult: {
      taskName: 'Edge Signal Processing Benchmark',
      score: 95,
      rubricScores: {
        architecture: 'Exceptional (96/100)',
        codeHygiene: 'Rigorous (94/100)',
        explanation: 'Deep theoretical mastery (95/100)',
      },
    },
    reviewer: 'Dr. Aris Thorne',
    reviewerRole: 'Professor, AI & Robotics Lab',
    reviewDate: '2026-10-02',
    limitations: 'Validated specifically for signal processing and deep learning; general enterprise web Python unreviewed.',
  },
  {
    id: 'ev-2',
    studentId: 'student-1',
    studentName: 'Lukmaan Hakim',
    skill: 'AI/ML',
    status: SKILL_STATUSES.PRACTICALLY_DEMONSTRATED,
    evidenceType: 'Competition Hackathon Finalist Certificate & Code Repo',
    evidenceUrl: 'https://hackathon.campus.edu/awards/2025/cardiovision',
    submissionDate: '2026-10-01',
    description: 'Top 5 Finalist at National Healthcare AI Hackathon 2025. Tested model against blinded test split.',
    assessmentResult: {
      taskName: 'Arrhythmia Inference Pipeline',
      score: 91,
      rubricScores: {
        architecture: 'Very Strong (92/100)',
        codeHygiene: 'Solid (90/100)',
        explanation: 'Clear (91/100)',
      },
    },
    reviewer: null,
    reviewerRole: null,
    reviewDate: null,
    limitations: 'Practical hackathon deployment evidence; requires formal academic peer review for clinical certification.',
  },
  {
    id: 'ev-3',
    studentId: 'student-1',
    studentName: 'Lukmaan Hakim',
    skill: 'Backend',
    status: SKILL_STATUSES.EVIDENCE_SUBMITTED,
    evidenceType: 'Project Link & Architecture Diagram',
    evidenceUrl: 'https://github.com/lukmaan-hakim/neuralcache',
    submissionDate: '2026-10-05',
    description: 'In-memory caching engine written in C++ with LRU eviction and socket listener.',
    assessmentResult: null,
    reviewer: null,
    reviewerRole: null,
    reviewDate: null,
    limitations: 'Project link submitted; awaiting independent faculty code audit or practical benchmark evaluation.',
  },
  {
    id: 'ev-4',
    studentId: 'student-2',
    studentName: 'Sarah Rahman',
    skill: 'UI/UX',
    status: SKILL_STATUSES.INDEPENDENTLY_REVIEWED,
    evidenceType: 'Figma Design System & User Testing Study',
    evidenceUrl: 'https://figma.com/@sarah_rahman/aura-health-ds',
    submissionDate: '2026-09-20',
    description: 'Complete multi-theme design system conforming to WCAG AAA accessibility standards with 40+ atomic components.',
    assessmentResult: {
      taskName: 'Design System Accessibility Walkthrough',
      score: 96,
      rubricScores: {
        architecture: 'Industry-Grade Token Structure (98/100)',
        codeHygiene: 'Flawless Auto-Layout Specs (95/100)',
        explanation: 'Empathetic Patient Persona Research (95/100)',
      },
    },
    reviewer: 'Prof. Elena Rostova',
    reviewerRole: 'Associate Professor, Design & Media',
    reviewDate: '2026-09-24',
    limitations: 'Certified for responsive web and mobile digital health products.',
  },
  {
    id: 'ev-5',
    studentId: 'student-3',
    studentName: 'Rahul Kumar',
    skill: 'Backend',
    status: SKILL_STATUSES.INDEPENDENTLY_REVIEWED,
    evidenceType: 'Microservice API Repo & AWS Certification',
    evidenceUrl: 'https://github.com/rahul-kumar/medfast-gateway',
    submissionDate: '2026-09-15',
    description: 'Production-ready REST and gRPC API handling 1,200 req/sec with PostgreSQL connection pooling.',
    assessmentResult: {
      taskName: 'High-Concurrency Ingestion Gateway',
      score: 94,
      rubricScores: {
        architecture: 'Clean Layered Architecture (95/100)',
        codeHygiene: 'Automated Pytest Coverage 92% (93/100)',
        explanation: 'Clear Database Indexing Strategy (94/100)',
      },
    },
    reviewer: 'Dr. Marcus Vance',
    reviewerRole: 'Assistant Professor, IT',
    reviewDate: '2026-09-22',
    limitations: 'Validated for Python FastAPI and PostgreSQL backends.',
  },
];

export const PRACTICAL_ASSESSMENT_TASKS = [
  {
    id: 'task-api-1',
    skill: 'Backend',
    title: 'FastAPI Telemetry Stream & Schema Validation',
    difficulty: 'Intermediate',
    timeEstimate: '30 Minutes',
    prompt: 'Construct a structured API endpoint that validates patient telemetry payloads, rejects uncalibrated sensor values, and streams JSON event objects with sub-20ms latency.',
    rubric: [
      { criterion: 'Schema Integrity', maxPoints: 35, description: 'Correct validation of boundaries, required headers, and error responses' },
      { criterion: 'Async Concurrency', maxPoints: 35, description: 'Non-blocking I/O and clean memory lifecycle' },
      { criterion: 'Code Hygiene & Tests', maxPoints: 30, description: 'Deterministic unit tests and clear API documentation' },
    ],
  },
  {
    id: 'task-ui-1',
    skill: 'UI/UX',
    title: 'High-Contrast Clinical Emergency Alert Component',
    difficulty: 'Intermediate',
    timeEstimate: '30 Minutes',
    prompt: 'Design an accessible alert card in Figma or HTML/CSS that conveys arrhythmia severity instantly to clinical staff in low-visibility hospital wards.',
    rubric: [
      { criterion: 'Contrast & Accessibility', maxPoints: 40, description: 'Strict WCAG AAA compliance, accessible text sizing and color hierarchy' },
      { criterion: 'Information Architecture', maxPoints: 30, description: 'Priority of vitals, heart rate waveform preview, and instant triage buttons' },
      { criterion: 'Visual Cohesion', maxPoints: 30, description: 'Clean typography, consistent spacing system, and micro-interaction states' },
    ],
  },
  {
    id: 'task-ml-1',
    skill: 'AI/ML',
    title: 'Signal Denoising & Anomaly Detection Pipeline',
    difficulty: 'Advanced',
    timeEstimate: '45 Minutes',
    prompt: 'Implement a digital filter and classification pipeline for noisy biosignals. Handle baseline wander and report precision/recall on simulated edge data.',
    rubric: [
      { criterion: 'Algorithmic Soundness', maxPoints: 40, description: 'Appropriate filter cutoff frequency and robust edge-case handling' },
      { criterion: 'Generalization & Evaluation', maxPoints: 35, description: 'Fair evaluation metrics without data leakage between train/test' },
      { criterion: 'Explanation & Rationale', maxPoints: 25, description: 'Ability to explain trade-offs between filter delay and noise suppression' },
    ],
  },
  {
    id: 'task-pitch-1',
    skill: 'Public Speaking',
    title: 'Technical Capstone 3-Minute Investor / Jury Pitch',
    difficulty: 'Intermediate',
    timeEstimate: '20 Minutes',
    prompt: 'Synthesize a complex technical architecture into a concise, persuasive 3-minute presentation that convinces a panel of technical judges and business mentors.',
    rubric: [
      { criterion: 'Clarity of Problem & Solution', maxPoints: 40, description: 'Hooks audience immediately, clearly articulates why existing tools fail' },
      { criterion: 'Pacing & Articulation', maxPoints: 30, description: 'Clear cadence, engaging inflection, professional poise' },
      { criterion: 'Handling Hard Questions', maxPoints: 30, description: 'Provides honest, defensible answers regarding technical limitations' },
    ],
  },
];
