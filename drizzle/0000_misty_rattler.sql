CREATE TABLE "chosen_ones" (
	"id" serial PRIMARY KEY NOT NULL,
	"pair_id" integer NOT NULL,
	"name_id" integer NOT NULL,
	"phase" integer NOT NULL,
	"marked_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_pair_chosen_name" UNIQUE("pair_id","name_id")
);
--> statement-breakpoint
CREATE TABLE "excluded_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_game_id" integer NOT NULL,
	"name_id" integer NOT NULL,
	"excluded_at" timestamp DEFAULT now() NOT NULL,
	"battle_id" integer,
	CONSTRAINT "unique_player_game_excluded_name" UNIQUE("player_game_id","name_id")
);
--> statement-breakpoint
CREATE TABLE "game_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"max_phase1_appearances" integer DEFAULT 3 NOT NULL,
	"chosen_one_threshold" integer DEFAULT 6 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "game_config_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_type" varchar(10) NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	CONSTRAINT "name_type_check" CHECK ("games"."name_type" IN ('boy', 'girl')),
	CONSTRAINT "status_check" CHECK ("games"."status" IN ('active', 'completed', 'abandoned'))
);
--> statement-breakpoint
CREATE TABLE "league_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"game_id" integer NOT NULL,
	"total_battles" integer DEFAULT 0 NOT NULL,
	"names_eliminated" integer DEFAULT 0 NOT NULL,
	"chosen_ones_count" integer DEFAULT 0 NOT NULL,
	"current_rank" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "name_appearances" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_game_id" integer NOT NULL,
	"name_id" integer NOT NULL,
	"appearance_count" integer DEFAULT 0 NOT NULL,
	"has_won" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_player_game_name" UNIQUE("player_game_id","name_id")
);
--> statement-breakpoint
CREATE TABLE "name_battles" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_game_id" integer NOT NULL,
	"name1_id" integer NOT NULL,
	"name2_id" integer NOT NULL,
	"phase" integer NOT NULL,
	"winner_id" integer,
	"doom_selected" boolean DEFAULT false NOT NULL,
	"battle_round" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "different_names" CHECK ("name_battles"."name1_id" != "name_battles"."name2_id"),
	CONSTRAINT "winner_or_doom" CHECK (("name_battles"."winner_id" IS NOT NULL AND "name_battles"."doom_selected" = false) OR ("name_battles"."winner_id" IS NULL AND "name_battles"."doom_selected" = true))
);
--> statement-breakpoint
CREATE TABLE "names" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_type" varchar(10) NOT NULL,
	"nationality" varchar(2) DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "idx_names_name_type" UNIQUE("name","name_type"),
	CONSTRAINT "name_type_check" CHECK ("names"."name_type" IN ('boy', 'girl'))
);
--> statement-breakpoint
CREATE TABLE "pair_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"inviter_email" varchar(255) NOT NULL,
	"invitee_email" varchar(255) NOT NULL,
	"game_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	CONSTRAINT "pair_invitations_token_unique" UNIQUE("token"),
	CONSTRAINT "status_check" CHECK ("pair_invitations"."status" IN ('pending', 'accepted', 'rejected', 'expired'))
);
--> statement-breakpoint
CREATE TABLE "pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user1_email" varchar(255) NOT NULL,
	"user2_email" varchar(255) NOT NULL,
	"game_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_pair_game" UNIQUE("user1_email","user2_email","game_id"),
	CONSTRAINT "status_check" CHECK ("pairs"."status" IN ('pending', 'active', 'dissolved')),
	CONSTRAINT "different_users" CHECK ("pairs"."user1_email" != "pairs"."user2_email")
);
--> statement-breakpoint
CREATE TABLE "player_games" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"game_id" integer NOT NULL,
	"pair_id" integer,
	"current_phase" integer DEFAULT 1 NOT NULL,
	"phase2_approval_status" varchar(20),
	"phase2_approval_requested_by_email" varchar(255),
	"battle_of_chosen_activated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_game" UNIQUE("user_email","game_id"),
	CONSTRAINT "phase2_approval_status_check" CHECK ("player_games"."phase2_approval_status" IS NULL OR "player_games"."phase2_approval_status" IN ('requested', 'approved', 'denied'))
);
--> statement-breakpoint
CREATE TABLE "tournament_brackets" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_game_id" integer NOT NULL,
	"phase" integer NOT NULL,
	"round" integer NOT NULL,
	"name_id" integer NOT NULL,
	"position" integer NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"parent_bracket_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "status_check" CHECK ("tournament_brackets"."status" IN ('active', 'winner', 'loser', 'eliminated'))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chosen_ones" ADD CONSTRAINT "chosen_ones_pair_id_pairs_id_fk" FOREIGN KEY ("pair_id") REFERENCES "public"."pairs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chosen_ones" ADD CONSTRAINT "chosen_ones_name_id_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "excluded_names" ADD CONSTRAINT "excluded_names_player_game_id_player_games_id_fk" FOREIGN KEY ("player_game_id") REFERENCES "public"."player_games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "excluded_names" ADD CONSTRAINT "excluded_names_name_id_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "excluded_names" ADD CONSTRAINT "excluded_names_battle_id_name_battles_id_fk" FOREIGN KEY ("battle_id") REFERENCES "public"."name_battles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_config" ADD CONSTRAINT "game_config_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_created_by_users_email_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_stats" ADD CONSTRAINT "league_stats_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_stats" ADD CONSTRAINT "league_stats_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_appearances" ADD CONSTRAINT "name_appearances_player_game_id_player_games_id_fk" FOREIGN KEY ("player_game_id") REFERENCES "public"."player_games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_appearances" ADD CONSTRAINT "name_appearances_name_id_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_battles" ADD CONSTRAINT "name_battles_player_game_id_player_games_id_fk" FOREIGN KEY ("player_game_id") REFERENCES "public"."player_games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_battles" ADD CONSTRAINT "name_battles_name1_id_names_id_fk" FOREIGN KEY ("name1_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_battles" ADD CONSTRAINT "name_battles_name2_id_names_id_fk" FOREIGN KEY ("name2_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_battles" ADD CONSTRAINT "name_battles_winner_id_names_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pair_invitations" ADD CONSTRAINT "pair_invitations_inviter_email_users_email_fk" FOREIGN KEY ("inviter_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pair_invitations" ADD CONSTRAINT "pair_invitations_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_user1_email_users_email_fk" FOREIGN KEY ("user1_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_user2_email_users_email_fk" FOREIGN KEY ("user2_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_games" ADD CONSTRAINT "player_games_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_games" ADD CONSTRAINT "player_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_games" ADD CONSTRAINT "player_games_pair_id_pairs_id_fk" FOREIGN KEY ("pair_id") REFERENCES "public"."pairs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_games" ADD CONSTRAINT "player_games_phase2_approval_requested_by_email_users_email_fk" FOREIGN KEY ("phase2_approval_requested_by_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_brackets" ADD CONSTRAINT "tournament_brackets_player_game_id_player_games_id_fk" FOREIGN KEY ("player_game_id") REFERENCES "public"."player_games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_brackets" ADD CONSTRAINT "tournament_brackets_name_id_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_brackets" ADD CONSTRAINT "tournament_brackets_parent_bracket_id_tournament_brackets_id_fk" FOREIGN KEY ("parent_bracket_id") REFERENCES "public"."tournament_brackets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_chosen_pair" ON "chosen_ones" USING btree ("pair_id");--> statement-breakpoint
CREATE INDEX "idx_chosen_name" ON "chosen_ones" USING btree ("name_id");--> statement-breakpoint
CREATE INDEX "idx_excluded_player_game" ON "excluded_names" USING btree ("player_game_id");--> statement-breakpoint
CREATE INDEX "idx_excluded_name" ON "excluded_names" USING btree ("name_id");--> statement-breakpoint
CREATE INDEX "idx_config_game" ON "game_config" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "idx_games_created_by" ON "games" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_games_status" ON "games" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_league_user_game" ON "league_stats" USING btree ("user_email","game_id");--> statement-breakpoint
CREATE INDEX "idx_league_rank" ON "league_stats" USING btree ("current_rank");--> statement-breakpoint
CREATE INDEX "idx_appearances_player_game" ON "name_appearances" USING btree ("player_game_id");--> statement-breakpoint
CREATE INDEX "idx_appearances_name" ON "name_appearances" USING btree ("name_id");--> statement-breakpoint
CREATE INDEX "idx_battles_player_game" ON "name_battles" USING btree ("player_game_id");--> statement-breakpoint
CREATE INDEX "idx_battles_phase" ON "name_battles" USING btree ("phase");--> statement-breakpoint
CREATE INDEX "idx_battles_winner" ON "name_battles" USING btree ("winner_id");--> statement-breakpoint
CREATE INDEX "idx_names_type" ON "names" USING btree ("name_type");--> statement-breakpoint
CREATE INDEX "idx_names_nationality" ON "names" USING btree ("nationality");--> statement-breakpoint
CREATE INDEX "idx_invitations_token" ON "pair_invitations" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_invitations_inviter" ON "pair_invitations" USING btree ("inviter_email");--> statement-breakpoint
CREATE INDEX "idx_invitations_email" ON "pair_invitations" USING btree ("invitee_email");--> statement-breakpoint
CREATE INDEX "idx_pairs_user1" ON "pairs" USING btree ("user1_email");--> statement-breakpoint
CREATE INDEX "idx_pairs_user2" ON "pairs" USING btree ("user2_email");--> statement-breakpoint
CREATE INDEX "idx_pairs_game" ON "pairs" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "idx_player_games_user" ON "player_games" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "idx_player_games_game" ON "player_games" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "idx_player_games_pair" ON "player_games" USING btree ("pair_id");--> statement-breakpoint
CREATE INDEX "idx_brackets_player_game" ON "tournament_brackets" USING btree ("player_game_id");--> statement-breakpoint
CREATE INDEX "idx_brackets_phase_round" ON "tournament_brackets" USING btree ("phase","round");--> statement-breakpoint
CREATE INDEX "idx_brackets_name" ON "tournament_brackets" USING btree ("name_id");