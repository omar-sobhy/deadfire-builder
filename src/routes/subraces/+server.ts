import { SubraceModel } from '$lib/db/index.js';
import { SubraceDto } from '$lib/dtos/subrace.dto.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const subraces = await SubraceModel.findAll({
    include: { all: true },
  });

  const subraceDtos = await Promise.all(
    subraces.map((s) => SubraceDto.from(s)),
  );

  return json(subraceDtos);
}
