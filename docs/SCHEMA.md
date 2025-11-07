# Database Schema Documentation

## Overview
This document describes the database schema for Chosen Club, including all tables, relationships, and constraints.

## Database Technology
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Migration Tool**: Drizzle Kit

## Tables

### `users`
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `email` | VARCHAR(255) | PRIMARY KEY, NOT NULL | User's email address (used as unique identifier, authentication, and invitations) |
| `name` | VARCHAR(255) | NULL | User's display name |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- Primary key index automatically created on `email`

### `games`
Represents a game session for selecting a name.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique game identifier |
| `name_type` | VARCHAR(10) | NOT NULL, CHECK | Either 'boy' or 'girl' |
| `created_by` | VARCHAR(255) | NOT NULL, FK → users.email | User who created the game |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Game creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'active' | Game status: 'active', 'completed', 'abandoned' |

**Indexes**:
- `idx_games_created_by` on `created_by`
- `idx_games_status` on `status`

### `pairs`
Represents a pair connection between two users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique pair identifier |
| `user1_email` | VARCHAR(255) | NOT NULL, FK → users.email | First user in the pair |
| `user2_email` | VARCHAR(255) | NOT NULL, FK → users.email | Second user in the pair |
| `game_id` | INTEGER | NOT NULL, FK → games.id | Game this pair is playing |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Pair status: 'pending', 'active', 'dissolved' |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Pair creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- `user1_email` must be different from `user2_email`
- Unique constraint on `(user1_email, user2_email, game_id)`

**Indexes**:
- `idx_pairs_user1` on `user1_email`
- `idx_pairs_user2` on `user2_email`
- `idx_pairs_game` on `game_id`

### `pair_invitations`
Stores pending pair invitations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique invitation identifier |
| `inviter_email` | VARCHAR(255) | NOT NULL, FK → users.email | User who sent the invitation |
| `invitee_email` | VARCHAR(255) | NOT NULL | Email address of the person being invited |
| `game_id` | INTEGER | NOT NULL, FK → games.id | Game the invitation is for |
| `token` | VARCHAR(255) | UNIQUE, NOT NULL | Unique token for invitation acceptance |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Invitation status: 'pending', 'accepted', 'rejected', 'expired' |
| `expires_at` | TIMESTAMP | NOT NULL | Invitation expiration timestamp |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Invitation creation timestamp |
| `accepted_at` | TIMESTAMP | NULL | When invitation was accepted |

**Indexes**:
- `idx_invitations_token` on `token`
- `idx_invitations_inviter` on `inviter_email`
- `idx_invitations_email` on `invitee_email`

### `names`
Stores the pool of names available for selection.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique name identifier |
| `name` | VARCHAR(255) | NOT NULL | The actual name |
| `name_type` | VARCHAR(10) | NOT NULL, CHECK | Either 'boy' or 'girl' |
| `nationality` | VARCHAR(2) | NOT NULL, DEFAULT 'unknown' | ISO 3166-1 alpha-2 country code (e.g., 'hu', 'en', 'us') or 'unknown' for name origin/nationality |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When name was added to system |

**Indexes**:
- `idx_names_type` on `name_type`
- `idx_names_nationality` on `nationality`
- `idx_names_name_type` on `(name, name_type)` (unique)

### `player_games`
Tracks a player's participation in a game (supports both solo and pair modes).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique player-game identifier |
| `user_email` | VARCHAR(255) | NOT NULL, FK → users.email | The player |
| `game_id` | INTEGER | NOT NULL, FK → games.id | The game |
| `pair_id` | INTEGER | NULL, FK → pairs.id | The pair (if in pair mode) |
| `current_phase` | INTEGER | NOT NULL, DEFAULT 1 | Current phase the player is in |
| `phase2_approval_status` | VARCHAR(20) | NULL | For pair mode: 'requested', 'approved', 'denied', NULL if not applicable |
| `phase2_approval_requested_by_email` | VARCHAR(255) | NULL, FK → users.email | Who requested phase 2 start |
| `battle_of_chosen_activated` | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether Battle of the Chosen is active |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When player joined game |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- Unique constraint on `(user_email, game_id)`
- If `pair_id` is not NULL, `phase2_approval_status` can be set

**Indexes**:
- `idx_player_games_user` on `user_email`
- `idx_player_games_game` on `game_id`
- `idx_player_games_pair` on `pair_id`

### `name_battles`
Records each battle between two names.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique battle identifier |
| `player_game_id` | INTEGER | NOT NULL, FK → player_games.id | The player-game this battle belongs to |
| `name1_id` | INTEGER | NOT NULL, FK → names.id | First name in battle |
| `name2_id` | INTEGER | NOT NULL, FK → names.id | Second name in battle |
| `phase` | INTEGER | NOT NULL | Phase number this battle occurred in |
| `winner_id` | INTEGER | NULL, FK → names.id | Winner name (NULL if DOOM was selected) |
| `doom_selected` | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether DOOM option was chosen |
| `battle_round` | INTEGER | NOT NULL | Round number within the phase |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When battle occurred |

**Constraints**:
- `name1_id` must be different from `name2_id`
- Either `winner_id` is set OR `doom_selected` is TRUE (but not both)

**Indexes**:
- `idx_battles_player_game` on `player_game_id`
- `idx_battles_phase` on `phase`
- `idx_battles_winner` on `winner_id`

### `name_appearances`
Tracks how many times a name has appeared for a player (for Phase 1 limit).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique appearance identifier |
| `player_game_id` | INTEGER | NOT NULL, FK → player_games.id | The player-game |
| `name_id` | INTEGER | NOT NULL, FK → names.id | The name |
| `appearance_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of times name has appeared |
| `has_won` | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether name has ever won a battle |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- Unique constraint on `(player_game_id, name_id)`

**Indexes**:
- `idx_appearances_player_game` on `player_game_id`
- `idx_appearances_name` on `name_id`

### `excluded_names`
Tracks names that have been excluded via DOOM option.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique exclusion identifier |
| `player_game_id` | INTEGER | NOT NULL, FK → player_games.id | The player-game |
| `name_id` | INTEGER | NOT NULL, FK → names.id | The excluded name |
| `excluded_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When name was excluded |
| `battle_id` | INTEGER | NULL, FK → name_battles.id | The battle that triggered exclusion |

**Constraints**:
- Unique constraint on `(player_game_id, name_id)`

**Indexes**:
- `idx_excluded_player_game` on `player_game_id`
- `idx_excluded_name` on `name_id`

### `chosen_ones`
Tracks names that have been selected by both players in a pair (pair mode only).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique chosen one identifier |
| `pair_id` | INTEGER | NOT NULL, FK → pairs.id | The pair |
| `name_id` | INTEGER | NOT NULL, FK → names.id | The chosen name |
| `phase` | INTEGER | NOT NULL | Phase when name was marked as chosen |
| `marked_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When name was marked as chosen |

**Constraints**:
- Unique constraint on `(pair_id, name_id)`

**Indexes**:
- `idx_chosen_pair` on `pair_id`
- `idx_chosen_name` on `name_id`

### `tournament_brackets`
Tracks tournament bracket structure for phases 2+.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique bracket identifier |
| `player_game_id` | INTEGER | NOT NULL, FK → player_games.id | The player-game |
| `phase` | INTEGER | NOT NULL | Phase number |
| `round` | INTEGER | NOT NULL | Round number within phase |
| `name_id` | INTEGER | NOT NULL, FK → names.id | Name in this bracket position |
| `position` | INTEGER | NOT NULL | Position in bracket (for ordering) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'active' | Status: 'active', 'winner', 'loser', 'eliminated' |
| `parent_bracket_id` | INTEGER | NULL, FK → tournament_brackets.id | Parent bracket (for loser's bracket) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When bracket entry was created |

**Indexes**:
- `idx_brackets_player_game` on `player_game_id`
- `idx_brackets_phase_round` on `(phase, round)`
- `idx_brackets_name` on `name_id`

### `game_config`
Stores configurable game settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique config identifier |
| `game_id` | INTEGER | NOT NULL, FK → games.id | The game |
| `max_phase1_appearances` | INTEGER | NOT NULL, DEFAULT 3 | Max times a name can appear in Phase 1 |
| `chosen_one_threshold` | INTEGER | NOT NULL, DEFAULT 6 | Threshold for Battle of the Chosen |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When config was created |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- Unique constraint on `game_id`

**Indexes**:
- `idx_config_game` on `game_id`

### `league_stats`
Stores league/leaderboard statistics for players.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique stat identifier |
| `user_email` | VARCHAR(255) | NOT NULL, FK → users.email | The player |
| `game_id` | INTEGER | NOT NULL, FK → games.id | The game |
| `total_battles` | INTEGER | NOT NULL, DEFAULT 0 | Total battles participated in |
| `names_eliminated` | INTEGER | NOT NULL, DEFAULT 0 | Number of names eliminated |
| `chosen_ones_count` | INTEGER | NOT NULL, DEFAULT 0 | Number of chosen ones (pair mode) |
| `current_rank` | INTEGER | NULL | Current league rank |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_league_user_game` on `(user_email, game_id)`
- `idx_league_rank` on `current_rank`

## Relationships Summary

```
users (1) ──< (many) games (created_by)
users (1) ──< (many) player_games (user_email)
users (1) ──< (many) pairs (user1_email)
users (1) ──< (many) pairs (user2_email)
users (1) ──< (many) pair_invitations (inviter_email)

games (1) ──< (many) pairs
games (1) ──< (many) player_games
games (1) ──< (1) game_config

pairs (1) ──< (many) player_games
pairs (1) ──< (many) chosen_ones

names (1) ──< (many) name_battles (name1_id)
names (1) ──< (many) name_battles (name2_id)
names (1) ──< (many) name_battles (winner_id)
names (1) ──< (many) name_appearances
names (1) ──< (many) excluded_names
names (1) ──< (many) chosen_ones
names (1) ──< (many) tournament_brackets

player_games (1) ──< (many) name_battles
player_games (1) ──< (many) name_appearances
player_games (1) ──< (many) excluded_names
player_games (1) ──< (many) tournament_brackets
```

## Data Integrity Rules

1. **Name Uniqueness**: A name can only exist once per name_type
2. **Pair Uniqueness**: A user cannot be in multiple pairs for the same game
3. **Phase 1 Limit**: A name cannot appear more than `max_phase1_appearances` times if it hasn't won
4. **DOOM Exclusion**: When DOOM is selected, both names in that battle are excluded
5. **Chosen One**: A name can only be marked as chosen one once per pair
6. **Phase 2 Approval**: In pair mode, phase 2 cannot start until both players approve
7. **Battle of Chosen**: Can only be activated when threshold is met and both players agree

## Migration Strategy

1. Create base tables in order of dependencies
2. Add foreign key constraints after all tables exist
3. Create indexes after table creation
4. Add check constraints and unique constraints
5. Seed initial name data

