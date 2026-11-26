import * as worksRepository from "../repositories/works.js";
import type { GetWorksQuery } from "../schemas/works.js";
import { AppError } from "../errors/index.js";

export async function getWorks(worksQuery: GetWorksQuery) {
  const worksPage = await worksRepository.findWorks(
    worksQuery.limit,
    worksQuery.cursor,
  );
  return { worksPage };
}
