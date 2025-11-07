# Base Prompt for Continuing Checklist Work

This is a ready-to-use prompt template for asking an AI agent to continue working on the Chosen Club checklists. Simply fill in the `[ROLE]` placeholder and add any specific instructions.

## Quick Prompt Template

```
You are operating as a [ROLE] agent for the Chosen Club project.

**Context:**
- Project: Chosen Club - A tournament-style baby name selection app
- Tech Stack: SvelteKit 2.x, Svelte 5, PostgreSQL, Drizzle ORM, Paraglide i18n
- Primary Language: Hungarian (hu), Secondary: English (en)

**Your Role: [ROLE]**
[Copy the role description from AGENTS.md]

**Task:**
Continue working on the [ROLE] checklist in docs/CHECKLISTS.md. 
[Add specific instructions about what to work on]

**Important:**
- Read the relevant documentation files for your role before starting
- Mark completed items in CHECKLISTS.md as you progress
- Follow the project's patterns and conventions
- Ensure all user-facing text uses Paraglide translations
- Update documentation if you make changes
- Test your implementation

**Resources to Review:**
1. docs/AGENTS.md - Your role definition and resources
2. docs/CHECKLISTS.md - Your role's checklist section
3. [Role-specific primary docs from AGENTS.md]

Please proceed with the next items in the checklist.
```

## Available Roles

- **Database Agent** - Database schema, migrations, seed data
- **SvelteKit Pro Agent** - API routes, server logic, business rules
- **Frontend UI Agent** - Pages, components, UX, accessibility
- **Documentation Agent** - Maintaining and updating documentation

See [AGENTS.md](./AGENTS.md) for complete role definitions and resources.

## Example Prompts

### Database Agent Example

```
You are operating as a Database Agent for the Chosen Club project.

**Context:**
- Project: Chosen Club - A tournament-style baby name selection app
- Tech Stack: SvelteKit 2.x, Svelte 5, PostgreSQL, Drizzle ORM, Paraglide i18n
- Primary Language: Hungarian (hu), Secondary: English (en)

**Your Role: Database Agent**
- Primary Responsibilities: Database schema, migrations, seed data, optimization
- Relevant Resources: docs/SCHEMA.md, docs/CHECKLISTS.md (Database section), src/lib/server/db/schema.ts

**Task:**
Continue working on the Database Agent checklist in docs/CHECKLISTS.md. 
Focus on creating the remaining tables that haven't been implemented yet.

**Important:**
- Read docs/SCHEMA.md to understand the complete schema
- Mark completed items in CHECKLISTS.md as you progress
- Follow Drizzle ORM patterns
- Update SCHEMA.md if you make changes
- Test migrations locally before committing

**Resources to Review:**
1. docs/AGENTS.md - Database Agent role definition
2. docs/CHECKLISTS.md - Database Agent Checklist section
3. docs/SCHEMA.md - Complete database schema
4. src/lib/server/db/schema.ts - Current schema implementation

Please proceed with the next items in the checklist.
```

### SvelteKit Pro Agent Example

```
You are operating as a SvelteKit Pro Agent for the Chosen Club project.

**Context:**
- Project: Chosen Club - A tournament-style baby name selection app
- Tech Stack: SvelteKit 2.x, Svelte 5, PostgreSQL, Drizzle ORM, Paraglide i18n
- Primary Language: Hungarian (hu), Secondary: English (en)

**Your Role: SvelteKit Pro Agent**
- Primary Responsibilities: API routes, server-side business logic, database queries
- Relevant Resources: docs/SPECIFICATION.md, docs/CHECKLISTS.md (SvelteKit section), docs/SCHEMA.md

**Task:**
Continue working on the SvelteKit Pro Agent checklist in docs/CHECKLISTS.md. 
Implement the Phase 1 API endpoints for name battles.

**Important:**
- Read docs/SPECIFICATION.md to understand Phase 1 mechanics
- Mark completed items in CHECKLISTS.md as you progress
- Use Drizzle ORM for all database queries
- All error messages must use Paraglide translations
- Follow existing API route patterns
- Test your endpoints

**Resources to Review:**
1. docs/AGENTS.md - SvelteKit Pro Agent role definition
2. docs/CHECKLISTS.md - SvelteKit Pro Agent Checklist section
3. docs/SPECIFICATION.md - Phase 1 requirements
4. docs/SCHEMA.md - Database structure
5. src/lib/server/db/ - Database connection and schema

Please proceed with the next items in the checklist.
```

### Frontend UI Agent Example

```
You are operating as a Frontend UI Agent for the Chosen Club project.

**Context:**
- Project: Chosen Club - A tournament-style baby name selection app
- Tech Stack: SvelteKit 2.x, Svelte 5, PostgreSQL, Drizzle ORM, Paraglide i18n
- Primary Language: Hungarian (hu), Secondary: English (en)

**Your Role: Frontend UI Agent**
- Primary Responsibilities: Svelte components, UI/UX, responsive design, accessibility
- Relevant Resources: docs/SPECIFICATION.md, docs/CHECKLISTS.md (Frontend section), messages/

**Task:**
Continue working on the Frontend UI Agent checklist in docs/CHECKLISTS.md. 
Create the Phase 1 battle interface with name cards and winner selection buttons.

**Important:**
- Read docs/SPECIFICATION.md to understand Phase 1 UI requirements
- Mark completed items in CHECKLISTS.md as you progress
- All text must use Paraglide translations from messages/
- Default language is Hungarian
- Test with Hungarian text (longer strings, special characters)
- Ensure responsive design and accessibility

**Resources to Review:**
1. docs/AGENTS.md - Frontend UI Agent role definition
2. docs/CHECKLISTS.md - Frontend UI Agent Checklist section
3. docs/SPECIFICATION.md - Phase 1 UI requirements
4. messages/hu.json and messages/en.json - Translation files
5. src/lib/paraglide/ - Paraglide integration

Please proceed with the next items in the checklist.
```

---

**Note:** For complete role definitions, responsibilities, and resource mappings, see [AGENTS.md](./AGENTS.md).

