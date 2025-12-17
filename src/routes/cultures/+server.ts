import { CultureModel } from '$lib/db/index.js';
import { CultureDto } from '$lib/dtos/culture.dto.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const cultures = await CultureModel.findAll({
    include: { all: true },
  });

  const cultureDtos = await Promise.all(
    cultures.map((c) => CultureDto.from(c)),
  );

  return json(cultureDtos);
}
