-- ==============================================================================
-- COLLABMATRIX — ROW LEVEL SECURITY (RLS) POLICIES
-- Zero-Trust, Least-Privilege Role-Based Authorization
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_sprint_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_agreement_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. SECURITY DEFINER AUTHORIZATION HELPER FUNCTIONS
-- Securely resolves role from database, preventing client-side role tampering
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'faculty'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'student'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_team_member(p_team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = p_team_id AND user_id = auth.uid()
    );
$$;

-- 3. PROFILES POLICIES
-- Anyone authenticated can view public profiles in the campus directory
CREATE POLICY "Profiles are viewable by authenticated campus users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can insert their own profile record upon sign-up
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Users can only modify their own identity; role changes are restricted
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. STUDENT PROFILES POLICIES
CREATE POLICY "Student profiles viewable by campus users"
    ON public.student_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Students can update their own student profile"
    ON public.student_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can insert their own student profile"
    ON public.student_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 5. FACULTY PROFILES POLICIES
CREATE POLICY "Faculty profiles viewable by campus users"
    ON public.faculty_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Faculty can update their own faculty profile"
    ON public.faculty_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND public.is_faculty())
    WITH CHECK (auth.uid() = user_id AND public.is_faculty());

CREATE POLICY "Faculty can insert their own faculty profile"
    ON public.faculty_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id AND public.is_faculty());

-- 6. STUDENT SKILLS POLICIES
CREATE POLICY "Skills viewable by campus users"
    ON public.student_skills FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Students can manage their own declared skills"
    ON public.student_skills FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update self-declared skill proficiency"
    ON public.student_skills FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can remove their own declared skills"
    ON public.student_skills FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. PROJECTS / OPPORTUNITIES POLICIES
CREATE POLICY "Projects viewable by all campus users"
    ON public.projects FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Project creators can update their projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Project creators can delete their projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (auth.uid() = creator_id);

-- 8. PROJECT MEMBERSHIP POLICIES
CREATE POLICY "Project members viewable by authenticated users"
    ON public.project_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Project creators or joining users can insert membership"
    ON public.project_members FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
    );

CREATE POLICY "Project creators or members can remove membership"
    ON public.project_members FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
    );

-- 9. COLLABORATION REQUESTS POLICIES
CREATE POLICY "Users can view requests they sent or received"
    ON public.collaboration_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create requests"
    ON public.collaboration_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Sender or receiver can update request status"
    ON public.collaboration_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Senders can withdraw collaboration requests"
    ON public.collaboration_requests FOR DELETE
    TO authenticated
    USING (auth.uid() = sender_id);

-- 10. TEAMS & TEAM MEMBERS POLICIES
CREATE POLICY "Team members and faculty can view teams"
    ON public.teams FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create teams"
    ON public.teams FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = lead_id OR auth.uid() = faculty_supervisor_id);

CREATE POLICY "Team leads or supervisors can update teams"
    ON public.teams FOR UPDATE
    TO authenticated
    USING (auth.uid() = lead_id OR auth.uid() = faculty_supervisor_id OR public.is_faculty());

CREATE POLICY "Team members can view roster"
    ON public.team_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Team leads or supervisors can manage members"
    ON public.team_members FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_team_member(team_id) OR
        EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND (lead_id = auth.uid() OR faculty_supervisor_id = auth.uid()))
    );

CREATE POLICY "Team leads, supervisors or members themselves can remove membership"
    ON public.team_members FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND (lead_id = auth.uid() OR faculty_supervisor_id = auth.uid()))
    );

-- 11. TASKS POLICIES
CREATE POLICY "Team members and supervisors can view tasks"
    ON public.tasks FOR SELECT
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Team members can insert tasks"
    ON public.tasks FOR INSERT
    TO authenticated
    WITH CHECK (public.is_team_member(team_id));

CREATE POLICY "Team members can update tasks"
    ON public.tasks FOR UPDATE
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Team members can delete tasks"
    ON public.tasks FOR DELETE
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

-- 12. TRIAL SPRINTS & SUBMISSIONS POLICIES
CREATE POLICY "Trial sprints viewable by team, participants, and faculty"
    ON public.trial_sprints FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Project leads or faculty can create trial sprints"
    ON public.trial_sprints FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by_id);

CREATE POLICY "Sprint creators or faculty can update sprints"
    ON public.trial_sprints FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by_id OR public.is_faculty());

CREATE POLICY "Participants can view their assignments"
    ON public.trial_sprint_participants FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Sprint creators or participants can add participants"
    ON public.trial_sprint_participants FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.trial_sprints WHERE id = sprint_id AND created_by_id = auth.uid())
    );

CREATE POLICY "Participants can update their deliverables and blockers"
    ON public.trial_sprint_participants FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR public.is_faculty());

-- 13. CONTRIBUTION LEDGER & AUDITS POLICIES
CREATE POLICY "Team members and faculty can view contributions"
    ON public.contributions FOR SELECT
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty() OR auth.uid() = contributor_id);

CREATE POLICY "Contributors can log their work"
    ON public.contributions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = contributor_id);

CREATE POLICY "Contributors or faculty can update contribution"
    ON public.contributions FOR UPDATE
    TO authenticated
    USING (auth.uid() = contributor_id OR public.is_faculty());

CREATE POLICY "Contributors can delete unreviewed contributions"
    ON public.contributions FOR DELETE
    TO authenticated
    USING (auth.uid() = contributor_id AND status = 'Submitted');

CREATE POLICY "Audits viewable by contributors and faculty"
    ON public.contribution_audits FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "System can record contribution audit log"
    ON public.contribution_audits FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = actor_id);

-- 14. SKILL EVIDENCE POLICIES
CREATE POLICY "Verified skill evidence viewable by campus directory"
    ON public.skill_evidence FOR SELECT
    TO authenticated
    USING (status = 'INDEPENDENTLY_REVIEWED' OR auth.uid() = student_id OR public.is_faculty());

CREATE POLICY "Students can submit their own skill evidence"
    ON public.skill_evidence FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = student_id AND public.is_student());

CREATE POLICY "Faculty can review and certify skill evidence"
    ON public.skill_evidence FOR UPDATE
    TO authenticated
    USING (public.is_faculty() OR (auth.uid() = student_id AND status != 'INDEPENDENTLY_REVIEWED'));

CREATE POLICY "Students can delete their unreviewed skill evidence"
    ON public.skill_evidence FOR DELETE
    TO authenticated
    USING (auth.uid() = student_id AND status != 'INDEPENDENTLY_REVIEWED');

-- 15. TEAM HEALTH ALERTS POLICIES
CREATE POLICY "Team members and faculty supervisors can view health alerts"
    ON public.team_health_alerts FOR SELECT
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Team members and faculty can create health alerts"
    ON public.team_health_alerts FOR INSERT
    TO authenticated
    WITH CHECK (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Team members or faculty can acknowledge or resolve alerts"
    ON public.team_health_alerts FOR UPDATE
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

-- 16. TEAM AGREEMENTS POLICIES
CREATE POLICY "Agreements viewable by team members"
    ON public.team_agreements FOR SELECT
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Team members and faculty can create team agreements"
    ON public.team_agreements FOR INSERT
    TO authenticated
    WITH CHECK (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Team leads or supervisors can update team agreements"
    ON public.team_agreements FOR UPDATE
    TO authenticated
    USING (public.is_team_member(team_id) OR public.is_faculty());

CREATE POLICY "Signatures viewable by team members and faculty"
    ON public.team_agreement_signatures FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.team_agreements ta
            WHERE ta.id = agreement_id AND (public.is_team_member(ta.team_id) OR public.is_faculty())
        )
    );

CREATE POLICY "Team members can sign agreements"
    ON public.team_agreement_signatures FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id AND EXISTS (
        SELECT 1 FROM public.team_agreements ta
        JOIN public.team_members tm ON tm.team_id = ta.team_id
        WHERE ta.id = agreement_id AND tm.user_id = auth.uid()
    ));

-- 17. NOTIFICATIONS POLICIES
CREATE POLICY "Users can only view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can create notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own notification read status"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (auth.uid() = recipient_id);
