import { getRepository } from "@nodal/content";

/** Single access point for content. Data source is configured in @nodal/content (mock ↔ Prisma). */
export const content = () => getRepository();
