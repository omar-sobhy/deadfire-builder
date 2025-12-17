import { ClassModel } from '$lib/db/index.js';
import { ClassDto } from '$lib/dtos/class.dto.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const classData = await ClassModel.findByPk(event.params.classId);

  if (!classData) {
    error(404, {
      message: 'Not found',
    });
  }

  const classDto = ClassDto.from(classData);

  return json(classDto);
}
