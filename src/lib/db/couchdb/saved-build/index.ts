import type { SavedBuild } from '../../../../types/saved-build.js';
import { CouchdbModel } from '../model.js';

export class SavedBuildModel extends CouchdbModel<{ version: number; data: SavedBuild }> {
  public override readonly dbName = 'saved_builds';
}
