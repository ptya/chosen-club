import { sql } from 'drizzle-orm';
import { check, index, pgTable, serial, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

export const names = pgTable(
	'names',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		nameType: varchar('name_type', { length: 10 }).notNull(),
		nationality: varchar('nationality', { length: 2 }).notNull().default('unknown'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [
		check('name_type_check', sql`${table.nameType} IN ('boy', 'girl')`),
		index('idx_names_type').on(table.nameType),
		index('idx_names_nationality').on(table.nationality),
		unique('idx_names_name_type').on(table.name, table.nameType),
	],
);
