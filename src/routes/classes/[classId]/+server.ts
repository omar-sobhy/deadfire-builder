import { ClassModel } from '$lib/db/index.js';
import { classModelToDto } from '$lib/server/model-to-dto/index.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const classData = await ClassModel.findByPk(event.params.classId);

  if (!classData) {
    error(404, {
      message: 'Not found',
    });
  }

  const classDto = classModelToDto(classData);

  return json(classDto);
}
