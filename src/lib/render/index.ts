import { StatusEffectType } from '../../types/enums/status-effect-type.js';
import type { Renderer } from './renderer.js';
import { Logger } from '$lib/utils.js';

interface RendererModule {
  default: {
    new (): Renderer;
  };
}

export class Renderers {
  private rendererMap: Partial<Record<StatusEffectType, Renderer>> = {};

  private renderers: Renderer[] = [];

  public constructor() {}

  public rendererFor(type: StatusEffectType): Renderer | undefined {
    if (this.rendererMap[type]) return this.rendererMap[type];

    if (this.renderers.length === 0) {
      const all = import.meta.glob<RendererModule>('./renderers/*.ts', {
        eager: true,
      });

      for (const m of Object.values(all)) {
        if (!('default' in m)) {
          Logger.getInstance().warn(`[Rendering] ${m} has no default export`);
        }
      }

      for (const { default: RendererConstructor } of Object.values(all)) {
        const renderer = new RendererConstructor();
        this.renderers.push(renderer);
        this.rendererMap[renderer.type] = renderer;
      }

      return this.rendererMap[type];
    }

    return undefined;
  }
}
