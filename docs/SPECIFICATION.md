# Chosen Club - Application Specification

## Overview
Chosen Club is a web application designed to help couples (or individuals) decide on a baby's name through an interactive tournament-style battle system. The application supports both solo and pair (couple) gameplay modes, with multiple phases that progressively narrow down name choices until a final winner emerges.

## Core Features

### Initial Setup
1. **Name Type Selection**: Users must select whether they're choosing a boy's name or a girl's name at the start
2. **Pair Invitation System**: 
   - Users can send email invitations to connect with a partner
   - Accepting an invitation creates a pair connection
   - Both players in a pair share the same game session

### Game Modes

#### Solo Mode
- Single player progresses through phases independently
- All decisions are made by one player

#### Pair Mode
- Two players (e.g., husband and wife) play together
- Players can be at different phases
- Synchronization points exist where both players must agree
- Names selected by both players are marked as "chosen one"
- Special "Battle of the Chosen" mode available when threshold is met

## Phase System

### Phase 1: Name Battle
**Objective**: Initial name selection through head-to-head battles

**Mechanics**:
- Two names are presented at a time
- Player must choose a winner between the two names
- Each name can appear a maximum of 3 times per player (if never chosen as winner)
- Once a name wins, it can appear more times in subsequent phases
- **DOOM Option**: Player can select "neither" - if chosen, both names are permanently excluded from that player's game
- Names that win battles progress to Phase 2

**Pair Mode Considerations**:
- Each player in a pair goes through Phase 1 independently
- Players can see how many games are in play (how many names were selected in Phase 1)
- No synchronization required in Phase 1

### Phase 2: Tournament Bracket (FIFA World Cup Style)
**Objective**: Further elimination through tournament-style brackets

**Mechanics**:
- Only names with scores (winners from Phase 1) appear
- Names are pitched against each other in bracket format
- Winners advance to the next level
- Losers get one more chance in a "loser's bracket" against another loser
- Phase 2 completes when all names have been played for the player

**Pair Mode Considerations**:
- Players go through Phase 2 separately
- One player cannot start Phase 2 until the other player approves (if one has already started)
- Once both players complete Phase 2, names selected by BOTH players are marked as "chosen one"
- Players can see the status of their partner's progress

### Phase 3 and Beyond
**Objective**: Continue elimination until one name remains

**Mechanics**:
- Repeats the Phase 2 pattern (tournament bracket style)
- Continues until only 1 name emerges as the winner
- Each phase further narrows down the selection

**Pair Mode Considerations**:
- Same synchronization rules as Phase 2
- "Chosen one" names continue to accumulate

### Battle of the Chosen (Pair Mode Only)
**Objective**: Final elimination from mutually selected names

**Trigger Conditions**:
- Available when at least 6 names are marked as "chosen one" (configurable threshold)
- Players can choose to activate this mode
- Once activated, all non-"chosen one" names are dropped from the game

**Mechanics**:
- Single elimination tournament
- Only "chosen one" names participate
- Continues until one final "Chosen One" name emerges

## User Interface Features

### League/Leaderboard
- Display league-like position rankings
- Show fun statistics and achievements
- Track progress across different players

### Progress Tracking
- Visual indicators for current phase
- Show number of names remaining
- Display "chosen one" count in pair mode
- Show partner's progress status in pair mode

### Game State Visibility
- Players can see how many games are in play
- Status of partner's progress (in pair mode)
- Number of names selected in each phase
- Current tournament bracket visualization

## Internationalization (i18n)

### Language Support
- **Primary Language**: Hungarian (hu)
- **Secondary Language**: English (en)
- **Translation System**: Paraglide (already configured in project)

### Implementation Requirements
- All user-facing text must be translated
- UI elements, buttons, labels, messages, and error text must support both languages
- Email templates must support both languages
- Language preference should be stored per user (optional: can default to browser language)
- Language switcher should be available in the UI
- Default language for new users: Hungarian

### Translation Coverage
- Landing page and navigation
- Game setup and configuration screens
- Battle interface (Phase 1, 2, 3+)
- Tournament bracket displays
- Pair invitation system
- League/leaderboard
- Error messages and notifications
- Email templates (invitations, notifications)
- Success messages and celebrations

### Technical Notes
- Paraglide is configured with base locale as Hungarian
- Translation files are located in `/messages/` directory
- Use Paraglide's message format for all translations
- Ensure proper pluralization and variable interpolation where needed

## Technical Requirements

### Data Persistence
- Game state must be saved for each player
- Support for resuming games
- Track all name battles and results
- Store pair connections and invitations

### Real-time Updates (Future Consideration)
- Optional: Real-time updates when partner makes decisions
- Optional: Notifications for approval requests

### Email System
- Send invitation emails
- Handle invitation acceptance
- Email verification/authentication
- Email templates must support both Hungarian and English

## Configuration

### Configurable Values
- Maximum number of times a name can appear in Phase 1 (default: 3)
- Threshold for "Battle of the Chosen" activation (default: 6)
- Tournament bracket sizes
- Number of phases before final selection

## Edge Cases to Handle

1. **Player Disconnection**: What happens if one player in a pair stops playing?
2. **Phase Synchronization**: How to handle when players are at different phases
3. **DOOM Selection**: Ensure both names are properly excluded
4. **Name Pool Exhaustion**: What if all names are eliminated?
5. **Invitation Expiration**: Handle stale invitations
6. **Multiple Invitations**: Handle cases where a user receives multiple pair requests

## Success Criteria

- Users can successfully complete a name selection journey
- Pair mode allows two players to collaborate effectively
- Game state is preserved across sessions
- Tournament logic correctly eliminates names
- "Chosen one" system works correctly in pair mode
- League/leaderboard provides engaging statistics

