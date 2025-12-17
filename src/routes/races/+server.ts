import { RaceModel } from '$lib/db/index.js';
import { RaceDto } from '$lib/dtos/race.dto.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const races = await RaceModel.findAll({
    include: { all: true },
  });

  const raceDtos = await Promise.all(races.map((r) => RaceDto.from(r)));

  return json(raceDtos);
}
