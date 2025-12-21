import { RaceModel } from '$lib/db/index.js';
import { raceModelToDto } from '$lib/server/model-to-dto/index.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const races = await RaceModel.findAll({
    include: [{ all: true }],
  });

  const raceDtos = await Promise.all(races.map((r) => raceModelToDto(r)));

  return json(raceDtos);
}
