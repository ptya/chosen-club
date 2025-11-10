import type { ParaglideLocals } from '@inlang/paraglide-sveltekit';

import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import type { User } from '$lib/server/db/schema';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			paraglide: ParaglideLocals<AvailableLanguageTag>;
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// interface ImportMetaEnv {}

	// This interface is needed for Vite
	// interface ImportMeta {
	// readonly env: ImportMetaEnv;
	// }
}

export {};
