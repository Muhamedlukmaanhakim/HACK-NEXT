/**
 * Trial Sprint dataset
 * Purpose: Test collaboration before long-term commitment.
 * Connects to project formation, skill evidence, team matching, and subsequent contributions.
 */

export const INITIAL_TRIAL_SPRINTS = [
  {
    id: 'sprint-1',
    teamId: 'team-1',
    opportunityId: 'opp-1',
    projectTitle: 'AI Healthcare Assistant',
    title: 'Trial Sprint #1: ECG Preprocessing & Diagnostic UI Wireframe',
    objective: 'Test collaboration between ML Lead, Backend, and Design candidate by delivering a functional parser and UI mock in 48 hours.',
    expectedDeliverable: 'A working Python script that parses raw ECG CSV data, plus a Figma prototype showing the diagnostic summary dashboard.',
    duration: '48 Hours',
    deadline: '2026-10-14T18:00:00Z',
    requiredSkills: ['Python', 'UI/UX', 'Figma'],
    aiPolicy: 'AI code assistance (Copilot/Claude) allowed for boilerplate, but all algorithmic logic and custom component design must be authored and explained by team members.',
    evaluationCriteria: [
      { name: 'Deliverable Quality', weight: '35%', description: 'Parses data correctly and matches clinical layout requirements' },
      { name: 'Communication & Coordination', weight: '25%', description: 'Active standup updates, responsive blocker discussions' },
      { name: 'Individual Evidence Ownership', weight: '25%', description: 'Clear demonstration of who wrote which module' },
      { name: 'On-Time Submission', weight: '15%', description: 'Delivered before sprint cutoff' },
    ],
    status: 'Active', // 'Active' | 'Awaiting Review' | 'Completed' | 'Incomplete' | 'Needs Revision' | 'Cancelled'
    participants: [
      {
        id: 'student-1',
        name: 'Lukmaan Hakim',
        role: 'Team Lead / ML Architect',
        status: 'Accepted',
        assignedTask: 'Build the NumPy/Pandas signal denoising filter module',
        submission: {
          submittedAt: '2026-10-10T14:30:00Z',
          deliverableUrl: 'https://github.com/lukmaan-hakim/ecg-filter-trial',
          description: 'Implemented 50Hz notch filter and baseline wander removal with clean docstrings.',
          blockersEncountered: 'Minor sampling rate discrepancy in sample dataset 3, resolved via resampling helper.',
        },
      },
      {
        id: 'student-3',
        name: 'Rahul Kumar',
        role: 'Backend Engineer',
        status: 'Accepted',
        assignedTask: 'FastAPI endpoint to ingest ECG CSV and stream JSON signal array',
        submission: {
          submittedAt: '2026-10-10T16:00:00Z',
          deliverableUrl: 'https://github.com/rahul-kumar/med-api-trial',
          description: 'Constructed async ingestion route with Pydantic validation schema.',
          blockersEncountered: 'None.',
        },
      },
      {
        id: 'student-2',
        name: 'Sarah Rahman',
        role: 'Candidate Product Designer',
        status: 'Accepted',
        assignedTask: 'Figma interactive component for real-time arrhythmia hazard alert',
        submission: {
          submittedAt: '2026-10-10T15:20:00Z',
          deliverableUrl: 'https://figma.com/file/trial-ecg-cardiovision',
          description: 'Delivered high-contrast brutalist patient alert card with waveform scrub slider.',
          blockersEncountered: 'Had to clarify color coding conventions with clinical guidelines.',
        },
      },
    ],
    reviewerFeedback: {
      reviewer: 'Dr. Aris Thorne',
      reviewerRole: 'Faculty Supervisor',
      reviewedAt: null,
      score: null,
      notes: 'Sprint in progress. Observational review pending upon final milestone deliverable cutoff.',
    },
    retrospectiveNotes: 'All 3 contributors have submitted tasks ahead of deadline. Team communication log shows 5 synchronized interactions.',
  },
  {
    id: 'sprint-2',
    teamId: 'team-2',
    opportunityId: 'opp-2',
    projectTitle: 'Campus Event Platform',
    title: 'Trial Sprint #1: QR Scanner Component & Ticket Schema',
    objective: 'Validate cross-stack integration between frontend React developer and event operations lead.',
    expectedDeliverable: 'Mobile responsive QR verification preview component in React + Firestore mock.',
    duration: '72 Hours',
    deadline: '2026-10-08T20:00:00Z',
    requiredSkills: ['React', 'JavaScript', 'UI/UX'],
    aiPolicy: 'Full disclosure of all generative code snippets required in PR summary.',
    evaluationCriteria: [
      { name: 'Component Responsiveness', weight: '40%', description: 'Operates smoothly across mobile viewports 360px-430px' },
      { name: 'Scan Latency', weight: '30%', description: 'Instant decoding under simulated camera frame capture' },
      { name: 'Team Alignment', weight: '30%', description: 'Daily asynchronous blocker reporting' },
    ],
    status: 'Completed',
    participants: [
      {
        id: 'student-13',
        name: 'Neha Gupta',
        role: 'Product Lead',
        status: 'Accepted',
        assignedTask: 'Ticket metadata taxonomy and validation error states',
        submission: {
          submittedAt: '2026-10-07T12:00:00Z',
          deliverableUrl: 'https://notion.so/ticket-schema-campus',
          description: 'Authored exhaustive ticket edge cases: duplicate scans, revoked passes, guest tiering.',
          blockersEncountered: 'None.',
        },
      },
      {
        id: 'student-5',
        name: 'Arjun Verma',
        role: 'Frontend Engineer',
        status: 'Accepted',
        assignedTask: 'Camera QR reader hook with visual feedback banner',
        submission: {
          submittedAt: '2026-10-07T17:40:00Z',
          deliverableUrl: 'https://github.com/arjun-verma/react-campus-qr',
          description: 'Built clean zero-dependency html5-qrcode wrapper with brutalist error banners.',
          blockersEncountered: 'Permissions prompt testing on iOS Safari required HTTPS dev tunnel.',
        },
      },
    ],
    reviewerFeedback: {
      reviewer: 'Prof. Elena Rostova',
      reviewerRole: 'Faculty Supervisor',
      reviewedAt: '2026-10-08T10:00:00Z',
      score: 92,
      notes: 'Exceptional mobile usability and clear division of responsibilities. Team is cleared for long-term project commitment.',
    },
    retrospectiveNotes: 'Trial proved that Arjun and Neha communicate quickly and deliver within 48 hours.',
  },
];
