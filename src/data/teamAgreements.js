/**
 * Team Agreement Charter dataset
 * Purpose: Pre-project alignment establishing responsibilities, availability,
 * communication channels, decision-making, AI attribution rules, and review expectations.
 */

export const INITIAL_TEAM_AGREEMENTS = [
  {
    id: 'agreement-1',
    teamId: 'team-1',
    opportunityId: 'opp-1',
    projectTitle: 'AI Healthcare Assistant',
    lastUpdated: '2026-10-06T12:00:00Z',
    terms: {
      responsibilities: 'Lukmaan Hakim leads machine learning model research and overall integration. Rahul Kumar leads microservice backend, API architecture, and database migrations.',
      weeklyAvailability: 'Minimum 15 hours per week during normal weeks; 25 hours during sprint windows (Weekends & Tuesday/Thursday evenings).',
      communicationChannels: 'Discord for daily asynchronous sync (#cardiovision-dev); Google Meet for weekly Sunday milestone review at 7:00 PM.',
      decisionProtocol: 'Technical architecture decisions require consensus of module owners. If deadlocked, team escalates to Faculty Supervisor Dr. Aris Thorne.',
      aiUsePolicy: 'AI code completion (Copilot, Cursor) permitted for syntax and unit tests. All model architectures, math formulas, and security components must be hand-verified and disclosed in the Contribution Ledger.',
      blockerHandling: 'Members must post blockers within 12 hours of being blocked. If a member becomes unavailable, work is redistributed or milestone scope is pruned with team consensus rather than punitive ranking.',
      reviewTurnaround: 'All pull requests and contribution ledger submissions must be reviewed by peers within 36 hours.',
    },
    signOffs: [
      {
        studentId: 'student-1',
        name: 'Lukmaan Hakim',
        signedAt: '2026-10-06T14:30:00Z',
        status: 'Acknowledged',
      },
      {
        studentId: 'student-3',
        name: 'Rahul Kumar',
        signedAt: '2026-10-06T15:10:00Z',
        status: 'Acknowledged',
      },
    ],
  },
];
