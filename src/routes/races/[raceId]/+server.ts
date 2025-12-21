import { RaceModel } from '$lib/db/index.js';
import { raceModelToDto } from '$lib/server/model-to-dto/index.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const raceData = await RaceModel.findByPk(event.params.raceId);

  if (!raceData) {
    error(404, {
      message: 'Not found',
    });
  }

  const raceDto = await raceModelToDto(raceData);

  return json(raceDto);
}
