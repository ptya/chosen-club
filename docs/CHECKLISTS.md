# Implementation Checklists

This document contains role-specific checklists for implementing Chosen Club. Each agent should work through their checklist, marking items as complete as they progress.

## Database Agent Checklist

### Schema Implementation
- [ ] Create `users` table with all required fields
- [ ] Create `games` table with all required fields
- [ ] Create `pairs` table with all required fields
- [ ] Create `pair_invitations` table with all required fields
- [ ] Create `names` table with all required fields
- [ ] Create `player_games` table with all required fields
- [ ] Create `name_battles` table with all required fields
- [ ] Create `name_appearances` table with all required fields
- [ ] Create `excluded_names` table with all required fields
- [ ] Create `chosen_ones` table with all required fields
- [ ] Create `tournament_brackets` table with all required fields
- [ ] Create `game_config` table with all required fields
- [ ] Create `league_stats` table with all required fields

### Constraints and Indexes
- [ ] Add all primary key constraints
- [ ] Add all foreign key constraints
- [ ] Add all unique constraints
- [ ] Add all check constraints (name_type, status values)
- [ ] Create all required indexes for performance
- [ ] Add NOT NULL constraints where appropriate
- [ ] Add default values where specified

### Relationships
- [ ] Verify all foreign key relationships are correct
- [ ] Test cascade behaviors (if any)
- [ ] Ensure referential integrity

### Migration Files
- [ ] Generate initial migration with `drizzle-kit generate`
- [ ] Review migration SQL for correctness
- [ ] Test migration on local database
- [ ] Document any manual migration steps needed

### Seed Data
- [ ] Create seed script for initial names (boys)
- [ ] Create seed script for initial names (girls)
- [ ] Test seed scripts
- [ ] Document seed data sources

### Database Functions/Triggers (if needed)
- [ ] Create trigger for `updated_at` timestamps
- [ ] Create any necessary database functions
- [ ] Test triggers and functions

### Query Optimization
- [ ] Review and optimize slow queries
- [ ] Add indexes for frequently queried columns
- [ ] Test query performance

### Documentation
- [ ] Update SCHEMA.md with any changes
- [ ] Document any custom database logic
- [ ] Create ER diagram (optional but helpful)

---

## SvelteKit Pro Agent Checklist

### Project Setup
- [ ] Verify SvelteKit configuration
- [ ] Set up environment variable handling
- [ ] Configure database connection in server code
- [ ] Set up error handling middleware
- [ ] Configure authentication system (if needed)
- [ ] Update Paraglide baseLocale to "hu" in project.inlang/settings.json
- [ ] Verify Paraglide middleware is properly configured in hooks.server.ts

### API Routes (Server Logic)

#### User Management
- [ ] `POST /api/users` - Create user
- [ ] `GET /api/users/me` - Get current user
- [ ] `PUT /api/users/me` - Update user profile

#### Game Management
- [ ] `POST /api/games` - Create new game
- [ ] `GET /api/games/:id` - Get game details
- [ ] `GET /api/games` - List user's games
- [ ] `PUT /api/games/:id` - Update game status

#### Pair Management
- [ ] `POST /api/pairs/invite` - Send pair invitation
- [ ] `GET /api/pairs/invitations` - Get pending invitations
- [ ] `POST /api/pairs/invitations/:token/accept` - Accept invitation
- [ ] `POST /api/pairs/invitations/:token/reject` - Reject invitation
- [ ] `GET /api/pairs/:id` - Get pair details

#### Phase 1 Logic
- [ ] `GET /api/games/:id/phase1/next-battle` - Get next name battle
- [ ] `POST /api/games/:id/phase1/battle` - Submit battle result
- [ ] `GET /api/games/:id/phase1/progress` - Get Phase 1 progress
- [ ] Implement DOOM option logic
- [ ] Implement 3-appearance limit logic
- [ ] Track name appearances per player

#### Phase 2 Logic
- [ ] `POST /api/games/:id/phase2/request-start` - Request Phase 2 start (pair mode)
- [ ] `POST /api/games/:id/phase2/approve` - Approve Phase 2 start (pair mode)
- [ ] `GET /api/games/:id/phase2/bracket` - Get tournament bracket
- [ ] `GET /api/games/:id/phase2/next-battle` - Get next battle in bracket
- [ ] `POST /api/games/:id/phase2/battle` - Submit Phase 2 battle result
- [ ] Implement winner advancement logic
- [ ] Implement loser's bracket logic
- [ ] Mark "chosen ones" when both players complete Phase 2

#### Phase 3+ Logic
- [ ] `GET /api/games/:id/phase/:phaseNumber/next-battle` - Get next battle
- [ ] `POST /api/games/:id/phase/:phaseNumber/battle` - Submit battle result
- [ ] Implement phase progression logic
- [ ] Detect when phase is complete
- [ ] Detect when game is complete (1 name remaining)

#### Battle of the Chosen
- [ ] `POST /api/games/:id/battle-of-chosen/activate` - Activate Battle of the Chosen
- [ ] `GET /api/games/:id/battle-of-chosen/status` - Get activation status
- [ ] Filter to only "chosen one" names
- [ ] Implement single elimination logic

#### League/Stats
- [ ] `GET /api/games/:id/league` - Get league standings
- [ ] `GET /api/games/:id/stats` - Get game statistics
- [ ] Calculate and update league stats
- [ ] Implement ranking algorithm

### Server Utilities
- [ ] Create database query helpers
- [ ] Create battle logic utilities
- [ ] Create tournament bracket generator
- [ ] Create name selection algorithm (avoid excluded, respect limits)
- [ ] Create email sending utility (for invitations)
- [ ] Create token generation utility (for invitations)
- [ ] Ensure all server-side error messages use Paraglide translations
- [ ] Create email template system with i18n support

### Error Handling
- [ ] Implement consistent error response format
- [ ] Add error logging
- [ ] Handle database errors gracefully
- [ ] Validate all input data
- [ ] Add rate limiting where appropriate

### Security
- [ ] Implement authentication/authorization
- [ ] Validate user ownership of resources
- [ ] Sanitize all user inputs
- [ ] Implement CSRF protection
- [ ] Secure API endpoints

### Testing
- [ ] Write unit tests for battle logic
- [ ] Write unit tests for tournament bracket logic
- [ ] Write integration tests for API routes
- [ ] Test pair mode synchronization
- [ ] Test phase transitions

### Documentation
- [ ] Document all API endpoints
- [ ] Document server-side business logic
- [ ] Update implementation notes

---

## Frontend UI Agent Checklist

### Design System
- [ ] Set up CSS framework or design system
- [ ] Define color palette and typography
- [ ] Create reusable component library
- [ ] Set up responsive breakpoints
- [ ] Create loading states and skeletons
- [ ] Set up Paraglide integration in components
- [ ] Create language switcher component
- [ ] Ensure typography supports Hungarian characters

### Core Pages

#### Landing/Home
- [ ] Create landing page
- [ ] Add "Start New Game" button
- [ ] Display existing games list
- [ ] Show game status indicators

#### Game Setup
- [ ] Create name type selection page (boy/girl)
- [ ] Create game creation flow
- [ ] Add pair invitation UI
- [ ] Display invitation status

#### Phase 1 UI
- [ ] Create battle interface (2 names side by side)
- [ ] Add "Choose Winner" buttons
- [ ] Add "DOOM" (neither) button
- [ ] Display progress indicator
- [ ] Show remaining battles count
- [ ] Display name appearance counts (debug info, optional)

#### Phase 2 UI
- [ ] Create tournament bracket visualization
- [ ] Display current round
- [ ] Show battle interface for Phase 2
- [ ] Display approval request UI (pair mode)
- [ ] Show partner's progress status
- [ ] Display "chosen ones" count
- [ ] Show loser's bracket visualization

#### Phase 3+ UI
- [ ] Reuse Phase 2 UI components
- [ ] Display phase number
- [ ] Show progression to final

#### Battle of the Chosen UI
- [ ] Create activation confirmation modal
- [ ] Display "Chosen Ones" list
- [ ] Show single elimination bracket
- [ ] Add special styling for this mode

#### League/Leaderboard
- [ ] Create league table/leaderboard
- [ ] Display player rankings
- [ ] Show fun statistics
- [ ] Add achievement badges (optional)

#### Pair Management
- [ ] Create pair invitation form
- [ ] Display pending invitations
- [ ] Show pair connection status
- [ ] Display partner's current phase

### Reusable Components
- [ ] `NameCard` - Display a name with styling
- [ ] `BattleView` - Two names in battle
- [ ] `ProgressBar` - Show phase progress
- [ ] `TournamentBracket` - Visual bracket display
- [ ] `LeagueTable` - Leaderboard component
- [ ] `PhaseIndicator` - Show current phase
- [ ] `ApprovalRequest` - Phase 2 approval UI
- [ ] `InvitationCard` - Display invitation
- [ ] `GameCard` - Display game summary
- [ ] `StatsWidget` - Display statistics
- [ ] `LanguageSwitcher` - Component to switch between hu/en

### User Experience
- [ ] Add smooth transitions between phases
- [ ] Implement loading states
- [ ] Add error message displays
- [ ] Create success celebrations (when game completes)
- [ ] Add confirmation dialogs for important actions
- [ ] Implement optimistic UI updates
- [ ] Add keyboard shortcuts (optional)

### Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test on desktop
- [ ] Ensure touch-friendly buttons
- [ ] Optimize bracket visualization for small screens

### Accessibility
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Ensure sufficient color contrast
- [ ] Add focus indicators

### Animations and Polish
- [ ] Add battle result animations
- [ ] Add phase transition animations
- [ ] Add hover effects
- [ ] Add micro-interactions
- [ ] Create celebration animations for winners

### State Management
- [ ] Set up state management (stores)
- [ ] Implement game state synchronization
- [ ] Handle real-time updates (if implemented)
- [ ] Manage loading states globally

### Integration
- [ ] Connect all UI to API endpoints
- [ ] Handle API errors gracefully
- [ ] Implement retry logic
- [ ] Add offline handling (optional)
- [ ] Use Paraglide messages for all user-facing text
- [ ] Implement language persistence (store user preference)
- [ ] Ensure all components use translated strings
- [ ] Test UI in both Hungarian and English

### Testing
- [ ] Write component tests
- [ ] Test user flows end-to-end
- [ ] Test responsive layouts
- [ ] Test accessibility
- [ ] Test language switching functionality
- [ ] Verify all translations are present and correct
- [ ] Test UI with Hungarian text (longer strings, special characters)
- [ ] Test email templates in both languages

### Documentation
- [ ] Document component props
- [ ] Create style guide
- [ ] Document design decisions

---

## Documentation Agent Checklist

### Initial Documentation
- [x] Create SPECIFICATION.md (application requirements)
- [x] Create SCHEMA.md (database schema)
- [x] Create SETUP.md (deployment and setup)
- [x] Create CHECKLISTS.md (this file)
- [x] Add internationalization requirements to SPECIFICATION.md

### API Documentation
- [ ] Document all API endpoints
- [ ] Create API request/response examples
- [ ] Document error codes and messages
- [ ] Create Postman collection (optional)

### User Documentation
- [ ] Create user guide for solo mode
- [ ] Create user guide for pair mode
- [ ] Create FAQ document
- [ ] Document game rules and mechanics
- [ ] Create tutorial/walkthrough

### Developer Documentation
- [ ] Document project structure
- [ ] Document coding conventions
- [ ] Create contribution guidelines
- [ ] Document testing strategy
- [ ] Document deployment process

### Architecture Documentation
- [ ] Create system architecture diagram
- [ ] Document data flow
- [ ] Document state management approach
- [ ] Document authentication flow

### Maintenance Documentation
- [ ] Document database backup procedures
- [ ] Document monitoring and alerting
- [ ] Document troubleshooting guide
- [ ] Document known issues and workarounds

### Updates and Maintenance
- [ ] Keep SPECIFICATION.md updated with changes
- [ ] Update SCHEMA.md when schema changes
- [ ] Update SETUP.md with new deployment steps
- [ ] Update checklists as features are completed
- [ ] Review and update all docs periodically

### Additional Resources
- [ ] Create glossary of terms
- [ ] Document configuration options
- [ ] Create changelog
- [ ] Document future roadmap
- [ ] Document translation workflow
- [ ] Create translation key naming conventions
- [ ] Document how to add new translations

---

## General Implementation Notes

### Priority Order
1. **Database Schema** - Foundation for everything
2. **Core API Routes** - Backend logic
3. **Basic UI** - User can interact
4. **Phase 1** - First playable feature
5. **Phase 2** - Tournament logic
6. **Pair Mode** - Collaboration features
7. **Polish** - UI/UX improvements
8. **League/Stats** - Engagement features

### Testing Strategy
- Test each phase independently
- Test pair mode synchronization thoroughly
- Test edge cases (DOOM, all names excluded, etc.)
- Test with different numbers of names
- Test phase transitions

### Communication
- Update checklists as work progresses
- Document any deviations from specification
- Note any technical decisions made
- Keep team informed of blockers

