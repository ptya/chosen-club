# Agent Guide for Chosen Club

This document provides guidance for AI agents working on the Chosen Club project. It defines agent roles, their responsibilities, and which resources are most relevant to each role.

## Agent Roles

The project uses a role-based approach where different agents focus on specific areas of implementation. When referencing a role, agents should prioritize the relevant sections and resources listed below.

### Database Agent

**Primary Responsibilities:**
- Database schema design and implementation
- Creating and managing database migrations
- Setting up database constraints, indexes, and relationships
- Creating seed data scripts
- Database optimization and query performance
- Database documentation updates

**Relevant Resources (Priority Order):**
1. **`docs/SCHEMA.md`** - Complete database schema documentation
   - All table structures
   - Relationships and foreign keys
   - Constraints and indexes
   - Data integrity rules
   - Migration strategy
2. **`docs/CHECKLISTS.md`** - "Database Agent Checklist" section
   - Schema implementation tasks
   - Migration tasks
   - Seed data tasks
3. **`src/lib/server/db/schema.ts`** - Actual schema implementation
4. **`drizzle.config.ts`** - Drizzle ORM configuration
5. **`docs/SPECIFICATION.md`** - Business rules that affect schema
   - Phase system mechanics
   - Pair mode requirements
   - Data persistence needs

**Key Technologies:**
- Drizzle ORM
- PostgreSQL
- Drizzle Kit (migrations)

**Common Tasks:**
- Creating new tables based on SCHEMA.md
- Generating migrations with `pnpm db:generate`
- Testing migrations locally
- Creating seed scripts for initial data

---

### SvelteKit Pro Agent

**Primary Responsibilities:**
- API route implementation (`/api/*` routes)
- Server-side business logic
- Database queries and data manipulation
- Authentication and authorization
- Error handling and validation
- Server utilities and helpers
- Email functionality
- Internationalization on server side

**Relevant Resources (Priority Order):**
1. **`docs/SPECIFICATION.md`** - Complete application requirements
   - Phase system mechanics
   - Game modes (Solo/Pair)
   - Business rules and logic
   - API endpoint requirements
2. **`docs/CHECKLISTS.md`** - "SvelteKit Pro Agent Checklist" section
   - API routes to implement
   - Server utilities needed
   - Error handling requirements
3. **`docs/SCHEMA.md`** - Database structure for queries
   - Table relationships
   - Data integrity rules
4. **`src/lib/server/db/`** - Database connection and schema
5. **`src/hooks.server.ts`** - Server hooks and middleware
6. **`docs/SETUP.md`** - Environment setup and configuration

**Key Technologies:**
- SvelteKit 2.x (API routes)
- Drizzle ORM (database queries)
- Paraglide (server-side i18n)
- TypeScript

**Common Tasks:**
- Creating API routes in `src/routes/api/`
- Implementing battle logic
- Tournament bracket generation
- Pair mode synchronization
- Email sending for invitations
- Server-side validation

**Important Notes:**
- All server-side error messages must use Paraglide translations
- Email templates must support both Hungarian and English
- Follow the API endpoint structure defined in CHECKLISTS.md

---

### Frontend UI Agent

**Primary Responsibilities:**
- Svelte component development
- User interface design and implementation
- User experience optimization
- Responsive design
- Accessibility implementation
- Client-side state management
- Internationalization in UI
- Animations and polish

**Relevant Resources (Priority Order):**
1. **`docs/SPECIFICATION.md`** - UI requirements and features
   - Phase UI requirements
   - User interface features
   - Game state visibility needs
2. **`docs/CHECKLISTS.md`** - "Frontend UI Agent Checklist" section
   - Pages to create
   - Components to build
   - UX requirements
3. **`src/routes/`** - Existing route structure
4. **`src/lib/paraglide/`** - Paraglide i18n integration
5. **`messages/`** - Translation files (hu.json, en.json)
6. **`docs/SCHEMA.md`** - Understanding data structure for UI

**Key Technologies:**
- Svelte 5 (with runes)
- SvelteKit 2.x
- Paraglide (client-side i18n)
- TypeScript
- CSS/SCSS (or chosen styling solution)

**Common Tasks:**
- Creating Svelte components
- Building page layouts
- Implementing battle interfaces
- Creating tournament bracket visualizations
- Language switcher component
- Responsive design implementation

**Important Notes:**
- All user-facing text must use Paraglide translations
- Default language is Hungarian (hu)
- Test UI with Hungarian text (longer strings, special characters)
- Ensure typography supports Hungarian characters

---

### Documentation Agent

**Primary Responsibilities:**
- Maintaining and updating documentation
- Creating API documentation
- Writing user guides
- Documenting architecture decisions
- Keeping checklists updated
- Creating developer documentation

**Relevant Resources (Priority Order):**
1. **`docs/CHECKLISTS.md`** - "Documentation Agent Checklist" section
2. **All documentation files** - Keep them synchronized
   - `docs/SPECIFICATION.md`
   - `docs/SCHEMA.md`
   - `docs/SETUP.md`
   - `docs/README.md`
   - `docs/AGENTS.md` (this file)
3. **Codebase** - Document actual implementation
4. **API routes** - Document endpoints

**Common Tasks:**
- Updating SPECIFICATION.md when requirements change
- Updating SCHEMA.md when database changes
- Documenting API endpoints
- Creating user guides
- Maintaining changelog

---

## Project Structure

```
chosen-club/
├── docs/                    # All documentation
│   ├── AGENTS.md           # This file
│   ├── CHECKLISTS.md        # Role-specific checklists
│   ├── SPECIFICATION.md    # Application requirements
│   ├── SCHEMA.md           # Database schema
│   ├── SETUP.md            # Setup and deployment
│   └── README.md           # Documentation index
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   └── db/         # Database schema and connection
│   │   └── paraglide/      # i18n generated files
│   ├── routes/
│   │   ├── api/            # API routes (SvelteKit Pro Agent)
│   │   └── +page.svelte    # Frontend pages (Frontend UI Agent)
│   └── hooks.server.ts     # Server hooks
├── messages/               # Translation files (hu.json, en.json)
├── drizzle.config.ts       # Drizzle configuration
├── svelte.config.js        # SvelteKit configuration
└── package.json            # Dependencies and scripts
```

## Key Technologies

- **Framework**: SvelteKit 2.x with Svelte 5
- **Database**: PostgreSQL with Drizzle ORM
- **Internationalization**: Paraglide (Hungarian primary, English secondary)
- **Hosting**: Netlify (frontend/serverless)
- **Package Manager**: pnpm
- **Language**: TypeScript

## Internationalization (i18n)

**Critical for all agents:**
- **Primary Language**: Hungarian (hu)
- **Secondary Language**: English (en)
- **Translation System**: Paraglide
- **Translation Files**: `messages/hu.json` and `messages/en.json`
- **Usage**: Import from `$lib/paraglide/messages.js` and use `m.messageKey()`
- **Server-side**: Use Paraglide server utilities in `src/lib/paraglide/`
- **Default**: All new users default to Hungarian

**Requirements:**
- All user-facing text must be translated
- Error messages must be translated
- Email templates must support both languages
- Test UI with Hungarian text (longer strings, special characters)

## Branching Strategy

**CRITICAL: All agents MUST create a new branch before starting work.**

### Branch Naming Convention

When starting work on a checklist, create a new branch using this pattern:

```
agent-[ROLE]-[task]
```

Where:
- `[ROLE]` is the agent role in lowercase (e.g., `database`, `sveltekit-pro`, `frontend-ui`, `documentation`)
- `[task]` is a short, descriptive task name in kebab-case (e.g., `create-users-table`, `phase1-api-routes`, `battle-interface`)

### Examples

- `agent-database-create-users-table`
- `agent-sveltekit-pro-phase1-api-routes`
- `agent-frontend-ui-battle-interface`
- `agent-documentation-api-docs`

### Branch Creation Process

1. **Before starting any work**, create a new branch:
   ```bash
   git checkout -b agent-[ROLE]-[task]
   ```
2. **Work on the branch** - Complete checklist items
3. **Commit changes** - Make regular commits with descriptive messages
4. **Push the branch** - Push to remote when ready for review:
   ```bash
   git push -u origin agent-[ROLE]-[task]
   ```
5. **Create pull request** - When work is complete or ready for review:
   - **Option A (if GitHub CLI is installed)**: Agent can create PR using `gh pr create`
   - **Option B (manual)**: Create PR via GitHub/GitLab web interface after branch is pushed
   - **Option C**: User creates PR after reviewing the pushed branch

### Pull Request Creation

**Can agents create pull requests?**

Agents can create pull requests if GitHub CLI (`gh`) is installed and authenticated. Otherwise, PRs should be created manually.

**If GitHub CLI is available:**
- Agent can create PR after pushing branch: `gh pr create --title "Description" --body "Details"`
- Agent will automatically create PR when work is complete

**If GitHub CLI is not available:**
- Agent will push the branch and note that PR needs to be created manually
- User can create PR via web interface or install GitHub CLI for future automation

**PR Best Practices:**
- Include descriptive title with role and task
- Add body explaining what was implemented
- Reference checklist items completed
- Note any breaking changes or important considerations

### Important Notes

- **Never work directly on `main` branch** - Always create a feature branch
- **One branch per task** - Create separate branches for different tasks
- **Descriptive names** - Use clear, descriptive task names in the branch name
- **Keep branches focused** - One branch should focus on one logical task or feature

## Working with Checklists

When continuing work on a checklist:

1. **Create a new branch** - Use the pattern `agent-[ROLE]-[task]` (see Branching Strategy above)
2. **Identify your role** - Which agent role are you operating as?
3. **Read the relevant checklist section** - Go to `docs/CHECKLISTS.md` and find your role's checklist
4. **Check off completed items** - Mark items as `[x]` when done
5. **Reference supporting docs** - Use the resources listed for your role above
6. **Update documentation** - If you make changes, update relevant docs
7. **Commit and push** - Make regular commits and push your branch

## Cross-Role Collaboration

Some tasks require coordination between roles:

- **Database + SvelteKit Pro**: When schema changes affect API routes
- **SvelteKit Pro + Frontend UI**: When API endpoints are needed for UI
- **All Roles + Documentation**: When changes need to be documented

## Common Patterns

### Database Queries
```typescript
import { db } from '$lib/server/db';
import { users, games } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const userGames = await db
  .select()
  .from(games)
  .where(eq(games.created_by, userEmail));
```

### API Routes
```typescript
// src/routes/api/games/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  // Implementation
  return json({ games: [] });
};
```

### Paraglide Usage
```typescript
// Client-side
import * as m from '$lib/paraglide/messages';
import { setLocale } from '$lib/paraglide/runtime';

// Use: m.welcomeMessage()
// Switch: setLocale('hu') or setLocale('en')
```

### Server-side Paraglide
```typescript
// Server-side
import { getLocale } from '$lib/paraglide/server';
import * as m from '$lib/paraglide/messages';

const locale = getLocale(event);
// Use locale-aware messages
```

## Quick Reference: Role → Resources

| Role | Primary Docs | Code Locations |
|------|-------------|----------------|
| **Database Agent** | SCHEMA.md, CHECKLISTS.md (Database section) | `src/lib/server/db/schema.ts`, `drizzle.config.ts` |
| **SvelteKit Pro Agent** | SPECIFICATION.md, CHECKLISTS.md (SvelteKit section) | `src/routes/api/`, `src/lib/server/` |
| **Frontend UI Agent** | SPECIFICATION.md, CHECKLISTS.md (Frontend section) | `src/routes/`, `src/lib/`, `messages/` |
| **Documentation Agent** | CHECKLISTS.md (Documentation section), All docs | All documentation files |

## Getting Started

1. **Read `docs/README.md`** - Overview of all documentation
2. **Read `docs/SPECIFICATION.md`** - Understand the application
3. **Identify your role** - Determine which agent role you're operating as
4. **Read your role's checklist** - Go to `docs/CHECKLISTS.md` and find your section
5. **Reference role-specific resources** - Use the resources listed above for your role
6. **Start implementing** - Work through checklist items systematically

---

## Base Prompt Template

When asking an agent to continue with checklist work, use this prompt template:

```
You are operating as a [ROLE] agent for the Chosen Club project.

**Context:**
- Project: Chosen Club - A tournament-style baby name selection app
- Tech Stack: SvelteKit 2.x, Svelte 5, PostgreSQL, Drizzle ORM, Paraglide i18n
- Primary Language: Hungarian (hu), Secondary: English (en)

**Your Role: [ROLE]**
- Primary Responsibilities: [See role section above]
- Relevant Resources: [See role section above]

**Branching (REQUIRED):**
- BEFORE starting any work, create a new branch using: `agent-[ROLE]-[task]`
- Replace [ROLE] with your role in lowercase (e.g., database, sveltekit-pro, frontend-ui, documentation)
- Replace [task] with a short descriptive task name in kebab-case (e.g., create-users-table, phase1-api-routes)
- Example: `agent-database-create-users-table`
- Use: `git checkout -b agent-[ROLE]-[task]`

**Task:**
Continue working on the [ROLE] checklist in docs/CHECKLISTS.md. 
[Add specific instructions about what to work on]

**Important:**
- Create a new branch FIRST before starting any work (see Branching above)
- Read the relevant documentation files for your role before starting
- Mark completed items in CHECKLISTS.md as you progress
- Follow the project's patterns and conventions
- Ensure all user-facing text uses Paraglide translations
- Update documentation if you make changes
- Test your implementation
- Make regular commits with descriptive messages
- Push the branch when work is complete
- Create a pull request if GitHub CLI (`gh`) is available, otherwise note that PR needs to be created manually

**Resources to Review:**
1. docs/AGENTS.md - Your role definition and branching strategy
2. docs/CHECKLISTS.md - Your role's checklist section
3. [Role-specific primary docs from above]
4. [Any other relevant files]

Please proceed with the next items in the checklist.
```

### Example Usage

```
You are operating as a Database Agent for the Chosen Club project.

**Context:**
- Project: Chosen Club - A tournament-style baby name selection app
- Tech Stack: SvelteKit 2.x, Svelte 5, PostgreSQL, Drizzle ORM, Paraglide i18n
- Primary Language: Hungarian (hu), Secondary: English (en)

**Your Role: Database Agent**
- Primary Responsibilities: Database schema, migrations, seed data, optimization
- Relevant Resources: docs/SCHEMA.md, docs/CHECKLISTS.md (Database section), src/lib/server/db/schema.ts

**Branching (REQUIRED):**
- BEFORE starting any work, create a new branch: `agent-database-create-remaining-tables`
- Use: `git checkout -b agent-database-create-remaining-tables`

**Task:**
Continue working on the Database Agent checklist in docs/CHECKLISTS.md. 
Focus on creating the remaining tables that haven't been implemented yet.

**Important:**
- Create a new branch FIRST before starting any work (see Branching above)
- Read docs/SCHEMA.md to understand the complete schema
- Mark completed items in CHECKLISTS.md as you progress
- Follow Drizzle ORM patterns
- Update SCHEMA.md if you make changes
- Test migrations locally before committing
- Make regular commits with descriptive messages

**Resources to Review:**
1. docs/AGENTS.md - Database Agent role definition and branching strategy
2. docs/CHECKLISTS.md - Database Agent Checklist section
3. docs/SCHEMA.md - Complete database schema
4. src/lib/server/db/schema.ts - Current schema implementation

Please proceed with the next items in the checklist.
```

---

## Notes for Future Agents

- **Create a new branch FIRST** - Always create a branch using `agent-[ROLE]-[task]` before starting any work (see Branching Strategy above)
- **Always read the relevant documentation** for your role before starting work
- **Check off checklist items** as you complete them
- **Update documentation** when you make changes
- **Test your work** before marking items complete
- **Follow existing patterns** in the codebase
- **Use Paraglide** for all user-facing text
- **Default to Hungarian** for new features
- **Coordinate with other roles** when changes affect multiple areas
- **Make regular commits** with descriptive messages

---

*Last Updated: [Current Date]*
*Maintained by: Documentation Agent*

