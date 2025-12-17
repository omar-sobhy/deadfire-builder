import { SubclassModel } from '$lib/db/index.js';
import { SubclassDto } from '$lib/dtos/subclass.dto.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const subclasses = await SubclassModel.findAll({
    include: { all: true },
  });

  const subclassDtos = await Promise.all(
    subclasses.map((s) => SubclassDto.from(s)),
  );

  return json(subclassDtos);
}
