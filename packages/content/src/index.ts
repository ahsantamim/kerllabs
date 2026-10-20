export * from "./types";
export * from "./permissions";
export { mockRepository } from "./repository";
export * as sampleData from "./data";

import { mockRepository } from "./repository";
import type { ContentRepository } from "./types";

let repo: ContentRepository = mockRepository;

/** Register a different data source at app start-up (e.g. the Prisma repository from @nodal/db). */
export function setRepository(next: ContentRepository) {
  repo = next;
}
export function getRepository(): ContentRepository {
  return repo;
}
