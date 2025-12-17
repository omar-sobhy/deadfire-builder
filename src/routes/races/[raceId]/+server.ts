import { RaceModel } from '$lib/db/index.js';
import { RaceDto } from '$lib/dtos/race.dto.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const raceData = await RaceModel.findByPk(event.params.raceId);

  if (!raceData) {
    error(404, {
      message: 'Not found',
    });
  }

  const raceDto = await RaceDto.from(raceData);

  return json(raceDto);
}
