import React from 'react';

export default function CollaborationMatrix({
  requirements = ['Python', 'UI/UX', 'Speech', 'Video'],
  members = [],
  className = '',
}) {
  // Normalize competencies
  const skillsList = requirements.length > 0
    ? requirements.map((r) => r.replace(/Public Speaking/i, 'SPEECH').replace(/Machine Learning/i, 'ML').toUpperCase())
    : ['PYTHON', 'UI/UX', 'SPEECH', 'VIDEO'];

  return (
    <div className={`p-4 sm:p-5 bg-white border-2 border-ink shadow-brutal font-mono space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-brutal-red">
            PUNCH-CARD MATRIX // SIGNATURE GRID
          </div>
          <h3 className="font-display font-black text-base text-ink uppercase tracking-tight">
            TEAM COMPETENCY MATRIX
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-ink">
          <span className="flex items-center gap-1.5">
            <span className="text-campus-green text-lg leading-none">●</span> PRESENT
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-ink/40 text-lg leading-none">○</span> MISSING
          </span>
        </div>
      </div>

      {/* Signature Punch-Card Matrix Table (Section 22) */}
      <div className="overflow-x-auto border-2 border-ink bg-white">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b-2 border-ink bg-canvas text-[11px] font-black text-ink uppercase">
              <th className="py-2.5 px-4 w-48">MEMBER</th>
              {skillsList.map((skill) => (
                <th key={skill} className="py-2.5 px-3 text-center whitespace-nowrap">
                  {skill}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink">
            {members.map((member, idx) => {
              const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
              const memberSkills = (member.skills || []).map((s) => s.toLowerCase());

              return (
                <tr key={member.id} className="hover:bg-canvas transition-colors">
                  <td className="py-2.5 px-4 font-bold text-ink uppercase whitespace-nowrap">
                    <span className="text-ink/50 mr-2 text-[10px]">{numStr} /</span>
                    {member.name.split(' ')[0].toUpperCase()}
                  </td>

                  {skillsList.map((skill) => {
                    const normSkill = skill.toLowerCase();
                    const hasSkill = memberSkills.some((s) =>
                      s.includes(normSkill) ||
                      (normSkill === 'speech' && (s.includes('speaking') || s.includes('presentation'))) ||
                      (normSkill === 'ui/ux' && (s.includes('ui') || s.includes('ux') || s.includes('design'))) ||
                      (normSkill === 'video' && s.includes('video'))
                    );

                    return (
                      <td key={skill} className="py-2.5 px-3 text-center text-lg leading-none">
                        {hasSkill ? (
                          <span
                            className="inline-block text-campus-green font-black select-none"
                            title={`${member.name} covers ${skill}`}
                          >
                            ●
                          </span>
                        ) : (
                          <span
                            className="inline-block text-ink/30 select-none"
                            title={`${member.name} lacks ${skill}`}
                          >
                            ○
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-ink/60 uppercase">
        <span>MEMBERS: 0{members.length} VERIFIED</span>
        <span className="text-ink font-bold">[ PUNCH-CARD REV 1.0 ]</span>
      </div>
    </div>
  );
}
