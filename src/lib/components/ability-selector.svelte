<script lang="ts">
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import cytoscape, { type Core, type ElementDefinition, type NodeSingular } from 'cytoscape';
  import type { Attachment } from 'svelte/attachments';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';
  import * as Dialog from './ui/dialog/index.js';
  import AbilityDescription from './ability-description.svelte';
  import { getDeadfireContext } from '$lib/context.svelte.js';
  import Button from './ui/button/button.svelte';
  import { makeSvg } from '$lib/utils.js';

  interface Props {
    mainPowerLevels: {
      passive: AbilityUnlockDto[];
      active: AbilityUnlockDto[];
    }[];

    multiPowerLevels?: {
      passive: AbilityUnlockDto[];
      active: AbilityUnlockDto[];
    }[];
  }

  interface Descendant {
    level: number;
    index: number;
    data: AbilityUnlockDto;
  }

  interface Subtree {
    node: AbilityUnlockDto;
    name: string;
    descendants: Subtree[];
    width: number;
    level: number;
    levelIndex: number;
    parent?: Subtree;
  }

  interface MapValue {
    width: number;
    level: number;
    index: number;
    data: Subtree;
  }

  const context = getDeadfireContext()();

  let { selectedClass, selectedMulticlass, renderers, statusEffectManager, selectedAbilities } =
    $derived(context);

  let availablePoints = $derived(20 - selectedAbilities.size);

  let dialogUnlock: AbilityUnlockDto | undefined = $state();

  let dialogOpen = $state(false);

  let { mainPowerLevels, multiPowerLevels }: Props = $props();

  let page = $state(0);

  let currentTable = $derived(page === 0 ? mainPowerLevels : (multiPowerLevels ?? mainPowerLevels));

  $effect(() => {
    if (!selectedMulticlass) {
      page = 0;
    }
  });

  function makePopper(node: NodeSingular, tree: Tree, cy: Core, text: string) {
    const unlock: AbilityUnlockDto = node.data('unlock');

    const div = document.createElement('div');

    div.classList.add(
      'hidden',
      'absolute',
      'bg-foreground',
      'text-background',
      'animate-in',
      'fade-in-0',
      'rounded-md',
      'px-3',
      'py-1.5',
      'text-xs',
      'text-balance',
      'node-popper',
    );

    const popper = node.popper({
      content: () => div,
    });

    div.innerText = text;

    node.on('mouseover', () => {
      div.classList.remove('hidden');
    });

    node.on('mouseout', () => {
      div.classList.add('hidden');
    });

    div.addEventListener('click', () => {
      const pos = tree.positions.get(unlock.addedAbility!.id);
      if (pos?.row !== 0) {
        toggleSelected(unlock.addedAbility!.id, node, cy);
      }
    });

    popper.update();

    document.body.appendChild(div);

    return { div, popper };
  }

  function toggleNodeIcon(node: NodeSingular, gray?: boolean) {
    const icon: string = node.data('icon');
    if (icon.includes('gray')) {
      if (gray === true) {
        return;
      }

      const newIcon = icon.replaceAll('-gray.png', '.png');
      node.data('icon', newIcon);
    } else {
      if (gray === false) {
        return;
      }

      const newIcon = icon.replaceAll('.png', '-gray.png');
      node.data('icon', newIcon);
    }
  }

  function deselect(id: string, node: NodeSingular, cy: cytoscape.Core) {
    const roots: string[] = [id];

    const nodes = cy.nodes();

    while (roots.length !== 0) {
      const next = roots.pop()!;

      selectedAbilities.delete(next);

      for (const n of nodes) {
        const unlock: AbilityUnlockDto = n.data('unlock');
        if (!unlock) {
          continue;
        }

        const id: string = n.data('id');

        if (unlock.requiredAbility?.id === next) {
          roots.push(id);

          toggleNodeIcon(n, true);
        }
      }
    }

    const subtree: Subtree = node.data('subtree');
    if (subtree.parent) {
      for (const d of subtree.parent.descendants) {
        const siblingId = d.node.addedAbility!.id;

        if (siblingId === id) {
          continue;
        }

        const node = cy!.getElementById(siblingId);

        toggleNodeIcon(node, false);
      }
    }
  }

  function select(id: string, node: NodeSingular, cy: cytoscape.Core) {
    const unlock: AbilityUnlockDto = node.data('unlock');
    if (!unlock) {
      return;
    }

    const subtree: Subtree = node.data('subtree');

    const level: number = node.data('level');
    if (multiPowerLevels && level > 7) {
      return;
    }

    if (unlock.requiredAbility) {
      if (
        subtree.parent &&
        subtree.parent.level !== 0 &&
        !selectedAbilities.has(unlock.requiredAbility.id)
      ) {
        return;
      }
    }

    if (unlock.mutuallyExclusive && subtree.parent) {
      for (const d of subtree.parent.descendants) {
        const siblingId = d.node.addedAbility!.id;
        if (selectedAbilities.has(siblingId) && siblingId !== id) {
          return;
        }
      }

      for (const d of subtree.parent.descendants) {
        const siblingId = d.node.addedAbility!.id;
        if (siblingId === id) {
          continue;
        }

        const sibling = cy.getElementById(siblingId);

        toggleNodeIcon(sibling, true);
      }
    }

    selectedAbilities.add(id);

    const nodes = cy.nodes();

    for (const n of nodes) {
      const unlock: AbilityUnlockDto | undefined = n.data('unlock');

      if (!unlock) {
        continue;
      }

      const sublevel: number = n.data('level');

      if (multiPowerLevels && sublevel > 7) {
        continue;
      }

      if (unlock.requiredAbility?.id === id) {
        toggleNodeIcon(n, false);
      }
    }
  }

  function toggleSelected(id: string, node: NodeSingular, cy: cytoscape.Core) {
    const exists = selectedAbilities.has(id);

    const unlock: AbilityUnlockDto = node.data('unlock');
    if (unlock.style === UnlockStyle.AutoGrant) {
      return;
    }

    if (exists) {
      deselect(id, node, cy);
    } else {
      select(id, node, cy);
    }
  }

  function iconUrl(url: string) {
    const parts = url.split('/');
    const len = parts.length;
    return encodeURI(`/icons/${parts[len - 1]}`);
  }

  function findDescendants(levels: AbilityUnlockDto[][], id: string) {
    const descendants: Descendant[] = [];

    for (let i = 0; i < levels.length; ++i) {
      for (let j = 0; j < levels[i].length; ++j) {
        if (levels[i][j].requiredAbility?.id === id) {
          descendants.push({
            level: i,
            index: j,
            data: levels[i][j],
          });
        }
      }
    }

    return descendants;
  }

  class Tree {
    added: Set<string> = new Set();

    levels: AbilityUnlockDto[][];

    builtLevels: ElementDefinition[][] = [];

    edges: ElementDefinition[] = [];

    subtrees: Subtree[] = [];

    /**
     * maps `row-col` -> value
     */
    slots: Map<string, MapValue> = new Map();

    /**
     * maps ability id -> row & col
     */
    positions: Map<string, { row: number; col: number }> = new Map();

    constructor(levels: AbilityUnlockDto[][]) {
      this.levels = levels;

      for (let i = 0; i < levels.length; ++i) {
        this.builtLevels[i] = [];
      }
    }

    buildSubtree(level: number, index: number): Subtree {
      const unlock = this.levels[level][index];

      const { addedAbility } = unlock;

      const { id, icon } = addedAbility!;

      const descendants = findDescendants(this.levels, id);

      this.added.add(addedAbility!.id);

      let width = 0;

      const descendantSubtrees: Subtree[] = [];

      for (const { level, index } of descendants) {
        const descendantSubtree = this.buildSubtree(level, index);

        width += descendantSubtree.width;

        descendantSubtrees.push(descendantSubtree);
      }

      const retVal = {
        node: unlock,
        name: addedAbility!.displayName!,
        descendants: descendantSubtrees,
        width: descendants.length === 0 ? 1 : width,
        level,
        levelIndex: index,
      };

      for (const d of descendantSubtrees) {
        d.parent = retVal;
      }

      return retVal;
    }

    placeSubtree(subtree: Subtree, parents: Subtree[] = []) {
      const row = subtree.level;

      for (let col = 0; col < 20; ++col) {
        const previousSlot = this.slots.get(`${row}-${col - 1}`);
        const previousStart = previousSlot?.index;
        const previousWidth = previousSlot?.width;
        const previousEnd = previousSlot && previousStart! + previousWidth!;

        let placeStart;

        if (previousSlot) {
          placeStart = previousStart! + previousWidth!;
        } else if (subtree.parent) {
          const parentPos = this.positions.get(subtree.parent.node.addedAbility!.id);
          const { row: parentRow, col: parentCol } = parentPos!;

          const parentSlot = this.slots.get(`${parentRow}-${parentCol}`);

          placeStart = parentSlot!.index + col;

          if (subtree.parent.descendants.length === 3) {
            --placeStart;
          }
        } else {
          placeStart = col;
        }

        if (this.slots.has(`${row}-${placeStart}`)) {
          continue;
        }

        if (previousSlot && placeStart >= previousStart! && placeStart < previousEnd!) {
          continue;
        }

        // check if placing node in this slot would conflict with edges from above levels
        let fits = true;
        for (let i = 0; i < row; ++i) {
          for (let j = 0; j <= placeStart; ++j) {
            const aboveSlot = this.slots.get(`${i}-${j}`);
            if (!aboveSlot) {
              continue;
            }

            const aboveData = aboveSlot.data;
            const { level, levelIndex } = aboveData;

            if (parents.find((p) => p.level === level && p.levelIndex === levelIndex)) {
              continue;
            }

            const descendants = aboveSlot.data.descendants;

            for (const d of descendants) {
              const belowPosition = this.positions.get(d.node.addedAbility!.id);

              const { row: belowRow, col: belowCol } = belowPosition!;

              const belowSlot = this.slots.get(`${belowRow}-${belowCol}`);

              let aboveStart = aboveSlot.index;
              let aboveEnd = aboveStart + aboveSlot.width;

              let aboveLevel = aboveSlot.level;
              let belowLevel = belowSlot!.level;

              if (
                aboveLevel <= row &&
                row < belowLevel &&
                placeStart >= aboveStart &&
                placeStart < aboveEnd
              ) {
                fits = false;
              }
            }
          }
        }

        if (!fits) {
          continue;
        }

        this.positions.set(subtree.node.addedAbility!.id, { row: row, col: placeStart });

        this.slots.set(`${row}-${placeStart}`, {
          data: subtree,
          width: subtree.width,
          level: row,
          index: placeStart,
        });

        for (const d of subtree.descendants) {
          this.placeSubtree(d, [...parents, subtree]);
        }

        return;
      }

      console.warn(`Could not place ${subtree.name}`);
    }

    buildNodes() {
      for (const [key, value] of this.slots.entries()) {
        const { index, level, data } = value;

        const addedAbility = data.node.addedAbility!;

        this.builtLevels[level] ??= [];
        this.builtLevels[level].push({
          data: {
            id: addedAbility.id,
            level,
            col: index + 1,
            icon: iconUrl(addedAbility.icon),
            name: addedAbility.displayName!,
            unlock: data.node,
            subtree: data,
          },
        });
      }
    }

    buildEdges(subtree: Subtree) {
      for (const descendant of subtree.descendants) {
        this.edges.push({
          group: 'edges',
          data: {
            source: subtree.node.addedAbility!.id,
            target: descendant.node.addedAbility!.id,
          },
        });

        this.buildEdges(descendant);
      }
    }

    buildTree() {
      for (let i = 0; i < this.levels.length; ++i) {
        for (let j = 0; j < this.levels[i].length; ++j) {
          const { addedAbility } = this.levels[i][j];
          if (this.added.has(addedAbility!.id)) {
            continue;
          }

          const result = this.buildSubtree(i, j);
          this.subtrees.push(result);
        }
      }

      for (const subtree of this.subtrees) {
        this.placeSubtree(subtree, [subtree]);
      }

      this.buildNodes();

      for (const subtree of this.subtrees) {
        this.buildEdges(subtree);
      }

      return this;
    }
  }

  function makeAttachment(abilities: AbilityUnlockDto[][]): Attachment<HTMLDivElement> {
    const sortedPowerLevels = abilities.map((l, index) => {
      return l.sort((lhs, rhs) => {
        const lhsName = lhs.addedAbility!.displayName;
        const rhsName = rhs.addedAbility!.displayName;

        if (lhsName && rhsName) {
          return lhsName!.localeCompare(rhsName!);
        }

        return 0;
      });
    });

    return (element) => {
      const cy = cytoscape({
        container: element,
        zoomingEnabled: false,
        panningEnabled: false,
        selectionType: 'single',
        autoungrabify: true,
        autounselectify: true,
        boxSelectionEnabled: false,
        style: [
          {
            selector: 'core',
            style: {
              'active-bg-opacity': 0,
              'ghost-opacity': 0,
              'overlay-opacity': 0,
              'min-width': '600px',
              width: '600px',
            },
          },
          {
            selector: 'node[^icon]',
            style: {
              'overlay-opacity': 0,
              shape: 'diamond',
              'border-width': 2,
              'background-image'(node) {
                const svg = makeSvg(node);
                const encoded = encodeURIComponent(svg.svg);
                const data = `data:image/svg+xml;utf-8,${encoded}`;

                return `url(${data})`;
              },
            },
          },
          {
            selector: 'node[icon]',
            style: {
              'overlay-opacity': 0,
              shape: 'rectangle',
              'background-image': function (node) {
                return node.data('icon');
              },
              'border-width': 2,
            },
          },
          {
            selector: 'edge',
            style: {
              'curve-style': 'taxi',
              'taxi-turn': '84%',
              'line-color': 'black',
            },
          },
        ],
      });

      const tree = new Tree(sortedPowerLevels);

      tree.buildTree();

      const allNodes: ElementDefinition[][] = tree.builtLevels;
      const allEdges: ElementDefinition[] = tree.edges;

      cy.add(allNodes.flat());
      cy.add(allEdges);

      const levelMarkers: ElementDefinition[] = [];
      for (let i = 0; i < 10; ++i) {
        levelMarkers.push({
          group: 'nodes',
          data: {
            level: i,
            col: 0,
          },
        });
      }

      const levelMarkerNodes = cy.add(levelMarkers);
      levelMarkerNodes.forEach((n) => {
        const powerLevel: number = n.data('level');

        let rendered;
        if (powerLevel === 0) {
          rendered = 'Available from level 1';
        } else if (multiPowerLevels) {
          if (powerLevel > 7) {
            rendered = 'Not available for multiclass characters';
          } else {
            rendered = `Available from level ${powerLevel * 3 - 2}`;
          }
        } else {
          if (powerLevel === 9) {
            rendered = 'Available from level 19';
          } else if (powerLevel === 8) {
            rendered = 'Available from level 16';
          } else {
            rendered = `Available from level ${powerLevel * 2 - 1}`;
          }
        }

        const { div, popper } = makePopper(n, tree, cy, rendered);

        n.on('mouseover', () => {
          div.classList.remove('hidden');
        });

        n.on('mouseout', () => {
          div.classList.add('hidden');
        });
      });

      const layout = cy.layout({
        name: 'grid',
        rows: 10,
        cols: 15,
        position(node) {
          return { row: node.data('level'), col: node.data('col') };
        },
      });

      layout.run();

      cy.nodes().forEach((n) => {
        if (!n.data('icon')) {
          return;
        }

        const unlock: AbilityUnlockDto = n.data('unlock');
        const pos = tree.positions.get(unlock.addedAbility!.id);
        if (pos?.row === 0 || unlock.style === UnlockStyle.AutoGrant) {
          n.style('border-color', 'green');
        }

        if (unlock.requiredAbility) {
          const parentPos = tree.positions.get(unlock.requiredAbility.id);
          if (!parentPos || parentPos.row !== 0) {
            const icon: string = n.data('icon');
            n.data('icon', icon.replaceAll('.png', '-gray.png'));
          }
        }

        if (multiPowerLevels && n.data('level') > 7) {
          toggleNodeIcon(n, true);
        }

        const { div, popper } = makePopper(n, tree, cy, unlock.addedAbility!.displayName!);

        n.on('mouseover', () => {
          div.classList.remove('hidden');
        });

        n.on('mouseout', () => {
          div.classList.add('hidden');
        });

        n.on('click, tap', (e) => {
          if (e.originalEvent.shiftKey) {
            dialogUnlock = n.data('unlock');
            dialogOpen = true;
            div.classList.add('hidden');
          } else {
            const pos = tree.positions.get(unlock.addedAbility!.id);
            if (pos?.row !== 0) {
              toggleSelected(unlock.addedAbility!.id, n, cy);
            }
          }
        });

        popper.update();
      });

      $effect(() => {
        cy.nodes().forEach((n) => {
          const id = n.id();

          const unlock: AbilityUnlockDto | undefined = n.data('unlock');
          if (!unlock) {
            return;
          }

          if (unlock.style === UnlockStyle.AutoGrant || selectedAbilities.has(id)) {
            n.style('border-color', 'green');
          } else {
            const pos = tree.positions.get(id);
            if (pos?.row !== 0) {
              n.style('border-color', 'black');
            }
          }
        });
      });

      $effect(() => {
        if (availablePoints === 0) {
          cy.nodes().forEach((n) => {
            const id: string = n.data('id');
            if (!selectedAbilities.has(id)) {
              toggleNodeIcon(n, true);
            }
          });
        }

        if (availablePoints === 1) {
          cy.nodes().forEach((n) => {
            const unlock: AbilityUnlockDto | undefined = n.data('unlock');
            if (!unlock) {
              return;
            }

            if (!unlock.requiredAbility) {
              toggleNodeIcon(n, false);
            } else if (selectedAbilities.has(unlock.requiredAbility.id)) {
              toggleNodeIcon(n, false);
            }
          });
        }
      });

      return () => {
        const els = document.querySelectorAll('.node-popper');
        els.forEach((e) => e.remove());

        cy.destroy();
      };
    };
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>
        {dialogUnlock?.addedAbility?.displayName ?? 'Unknown ability name'}
      </Dialog.Title>
    </Dialog.Header>
    <AbilityDescription {renderers} {statusEffectManager} abilityUnlock={dialogUnlock!} />
    <Dialog.Footer>
      <Dialog.Close>Ok</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
<div>
  <div class="px-2 flex flex-col p-0 m-0 pb-4">
    <div class="flex flex-row gap-3">
      Available points: {availablePoints}
      {#if selectedMulticlass}
        <div class="border border-foreground rounded w-fit bg-ring flex flex-row overflow-clip">
          <Button
            variant="ghost"
            class={[
              page === 0 ? 'bg-green-500 hover:bg-green-500! rounded-l!' : 'hover:bg-green-700!',
              'size-fit py-0 rounded-r-none',
            ]}
            onclick={() => (page = 0)}
          >
            <img
              src={iconUrl(`class_${selectedClass.icon.toLowerCase()}`)}
              alt={selectedClass.displayName!}
              title="Swap class"
              class="size-7"
            />
          </Button>
          <Button
            variant="ghost"
            class={[
              page === 1 ? 'bg-green-500 hover:bg-green-500! rounded-none!' : 'hover:bg-green-700!',
              'size-fit py-0 rounded-0',
            ]}
            onclick={() => (page = 1)}
          >
            <img
              src={iconUrl(`class_${selectedMulticlass.icon.toLowerCase()}`)}
              alt={selectedMulticlass.displayName!}
              title="Swap class"
              class="size-7"
            />
          </Button>
          <div class="px-2 bg-border">
            {page === 0 ? selectedClass.displayName! : selectedMulticlass.displayName!}
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div
    class="flex flex-row w-full max-md:w-[300] overflow-x-auto overscroll-contain bg-[repeating-linear-gradient(#9e8c6e,#9e8c6e_10%,#ccb899_10%,#ccb899_20%)]"
  >
    <div
      id="cytoscape-actives"
      class="h-[50dvh] w-200 block shrink-0"
      {@attach makeAttachment(currentTable!.map((l) => l.active))}
    ></div>
    <div
      id="cytoscape-passives"
      class="h-[50dvh] w-300 block shrink-0"
      {@attach makeAttachment(currentTable!.map((l) => l.passive))}
    ></div>
  </div>
</div>
