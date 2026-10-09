-- ==============================================================================
-- COLLABMATRIX — POSTGRESQL SCHEMA MIGRATION 001
-- Multi-Role Campus Collaboration Network: Students & Faculty
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TAXONOMIES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'faculty');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_evidence_tier AS ENUM (
        'SELF_DECLARED',
        'EVIDENCE_SUBMITTED',
        'PRACTICALLY_DEMONSTRATED',
        'INDEPENDENTLY_REVIEWED'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('Pending', 'Accepted', 'Declined', 'Withdrawn');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sprint_status AS ENUM (
        'Draft',
        'Active',
        'Review Pending',
        'Completed',
        'Incomplete',
        'Needs Revision',
        'Cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE contribution_status AS ENUM (
        'Submitted',
        'Awaiting Review',
        'Acknowledged',
        'Reviewed',
        'Needs Clarification',
        'Disputed'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. PROFILES (Base Identity Table bound to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    department TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT PROFILES (Specific academic details)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    roll_number TEXT DEFAULT '',
    academic_year TEXT DEFAULT '',
    semester TEXT DEFAULT '',
    domain TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    availability JSONB DEFAULT '[]'::jsonb,
    interests TEXT[] DEFAULT '{}',
    has_completed_dna BOOLEAN DEFAULT FALSE,
    collaboration_dna JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FACULTY PROFILES (Specific academic research & mentoring vectors)
CREATE TABLE IF NOT EXISTS public.faculty_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id TEXT DEFAULT '',
    designation TEXT DEFAULT '',
    expertise TEXT DEFAULT '',
    research_interests TEXT[] DEFAULT '{}',
    mentoring_areas TEXT[] DEFAULT '{}',
    office_location TEXT DEFAULT '',
    office_hours TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENT SKILLS & PROFICIENCY
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    proficiency INTEGER CHECK (proficiency BETWEEN 1 AND 5) DEFAULT 3,
    status skill_evidence_tier NOT NULL DEFAULT 'SELF_DECLARED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill)
);

-- 7. PROJECTS / OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    project_type TEXT NOT NULL DEFAULT 'Project',
    team_size INTEGER NOT NULL DEFAULT 4,
    required_skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    availability TEXT[] DEFAULT '{}',
    department TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Open',
    is_faculty_initiative BOOLEAN DEFAULT FALSE,
    min_evidence_tier skill_evidence_tier DEFAULT 'SELF_DECLARED',
    require_trial_sprint BOOLEAN DEFAULT FALSE,
    credit_offering TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROJECT MEMBERSHIP
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Contributor',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- 9. COLLABORATION REQUESTS & INVITATIONS
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('incoming', 'outgoing', 'sent', 'invitation', 'application')),
    status request_status NOT NULL DEFAULT 'Pending',
    message TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    opportunity_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    faculty_supervisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'Member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 12. PROJECT TASKS & DEPENDENCY GRAPH
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    deliverable TEXT DEFAULT '',
    assigned_to_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_essential BOOLEAN NOT NULL DEFAULT FALSE,
    required_skill TEXT DEFAULT '',
    deadline DATE,
    status TEXT NOT NULL DEFAULT 'Todo', -- 'Todo' | 'In Progress' | 'Blocked' | 'Completed'
    depends_on_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    estimated_hours INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TRIAL SPRINTS (Priority Feature 1)
CREATE TABLE IF NOT EXISTS public.trial_sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    expected_deliverable TEXT NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 48,
    deadline TIMESTAMPTZ,
    required_skills TEXT[] DEFAULT '{}',
    ai_policy TEXT DEFAULT '',
    evaluation_criteria JSONB DEFAULT '[]'::jsonb,
    status sprint_status NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TRIAL SPRINT PARTICIPANTS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.trial_sprint_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id UUID NOT NULL REFERENCES public.trial_sprints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Candidate',
    assigned_task TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Accepted', -- 'Invited' | 'Accepted' | 'Declined'
    deliverable_url TEXT DEFAULT '',
    submission_notes TEXT DEFAULT '',
    blockers_encountered TEXT DEFAULT '',
    submitted_at TIMESTAMPTZ,
    score INTEGER,
    feedback TEXT DEFAULT '',
    UNIQUE(sprint_id, user_id)
);

-- 15. CONTRIBUTION LEDGER (Priority Feature 2)
CREATE TABLE IF NOT EXISTS public.contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL DEFAULT 'Engineering',
    evidence_type TEXT NOT NULL,
    evidence_url TEXT NOT NULL,
    ai_disclosure TEXT NOT NULL,
    status contribution_status NOT NULL DEFAULT 'Submitted',
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CONTRIBUTION AUDIT LOGS (Immutable History)
CREATE TABLE IF NOT EXISTS public.contribution_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SKILL EVIDENCE (Evidence-driven integrity)
CREATE TABLE IF NOT EXISTS public.skill_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    status skill_evidence_tier NOT NULL DEFAULT 'SELF_DECLARED',
    evidence_type TEXT NOT NULL,
    evidence_url TEXT,
    description TEXT NOT NULL,
    assessment_result JSONB,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_date DATE,
    limitations TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TEAM HEALTH ALERTS (Priority Feature 3)
CREATE TABLE IF NOT EXISTS public.team_health_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
    category TEXT NOT NULL,
    deliverable_affected TEXT,
    what_detected TEXT NOT NULL,
    supporting_evidence TEXT NOT NULL,
    missing_information TEXT DEFAULT '',
    recommended_actions TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Acknowledged', 'Resolved')),
    acknowledged_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TEAM COLLABORATION AGREEMENTS
CREATE TABLE IF NOT EXISTS public.team_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    clauses JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_agreement_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID NOT NULL REFERENCES public.team_agreements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agreement_id, user_id)
);

-- 20. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_student_skills_user ON public.student_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator ON public.projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON public.tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_trial_sprints_team ON public.trial_sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_contributions_team ON public.contributions(team_id);
CREATE INDEX IF NOT EXISTS idx_contributions_contributor ON public.contributions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_student ON public.skill_evidence(student_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_team ON public.team_health_alerts(team_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);

-- 22. AUTOMATIC PROFILE PROVISIONING TRIGGER
-- Synchronizes new Supabase Auth registrations with public.profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, department)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        CASE 
            WHEN lower(COALESCE(new.raw_user_meta_data->>'role', '')) = 'faculty' THEN 'faculty'::user_role
            ELSE 'student'::user_role
        END,
        COALESCE(new.raw_user_meta_data->>'department', '')
    )
    ON CONFLICT (id) DO NOTHING;

    -- Automatically initialize student or faculty sub-profile
    IF lower(COALESCE(new.raw_user_meta_data->>'role', 'student')) = 'faculty' THEN
        INSERT INTO public.faculty_profiles (user_id, employee_id, designation)
        VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'facultyId', ''),
            COALESCE(new.raw_user_meta_data->>'designation', '')
        )
        ON CONFLICT (user_id) DO NOTHING;
    ELSE
        INSERT INTO public.student_profiles (user_id, roll_number, academic_year)
        VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'rollNo', ''),
            COALESCE(new.raw_user_meta_data->>'year', '')
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN new;
END;
$$;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
