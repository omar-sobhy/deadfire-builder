import { CultureModel } from '$lib/db/index.js';
import { cultureModelToDto } from '$lib/server/model-to-dto/index.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const cultures = await CultureModel.findAll({
    include: [{ all: true }],
  });

  const cultureDtos = await Promise.all(
    cultures.map((c) => cultureModelToDto(c)),
  );

  return json(cultureDtos);
}
