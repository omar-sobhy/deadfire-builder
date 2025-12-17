import { ClassModel } from '$lib/db/index.js';
import { ClassDto } from '$lib/dtos/class.dto.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const classes = await ClassModel.findAll({
    include: { all: true },
  });

  const classDtos = await Promise.all(classes.map((c) => ClassDto.from(c)));

  return json(classDtos);
}
