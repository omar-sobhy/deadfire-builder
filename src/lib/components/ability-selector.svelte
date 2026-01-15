<script lang="ts">
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import cytoscape, { type Core, type ElementDefinition, type NodeSingular } from 'cytoscape';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';
  import * as Dialog from './ui/dialog/index.js';
  import AbilityDescription from './ability-description.svelte';
  import { getDeadfireContext } from '$lib/context.svelte.js';
  import Button from './ui/button/button.svelte';
  import { makeSvg } from '$lib/utils.js';
  import { onMount, untrack } from 'svelte';

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

  const singleClassPowerLevelThresholds = [1, 3, 5, 7, 9, 11, 13, 16, 19];
  const multiclassPowerLevelThresholds = [1, 4, 7, 10, 13, 16, 19];

  let { selectedClass, selectedMulticlass, renderers, statusEffectManager, selectedAbilities } =
    $derived(context);

  let usedPoints = $derived.by(() => {
    (void selectedClass, void selectedMulticlass);

    return 0;
  });

  let currentLevelPoints = $derived.by(() => {
    if (selectedMulticlass && multiclassPowerLevelThresholds.includes(context.currentLevel)) {
      return 2;
    }

    if (!selectedMulticlass && singleClassPowerLevelThresholds.includes(context.currentLevel)) {
      return 2;
    }

    return 1;
  });

  let currentPowerLevel = $derived.by(() => {
    const thresholds = selectedMulticlass
      ? multiclassPowerLevelThresholds
      : singleClassPowerLevelThresholds;

    for (let i = 0; i < thresholds.length; ++i) {
      if (
        thresholds[i] <= context.currentLevel &&
        context.currentLevel < (thresholds[i + 1] ?? 22)
      ) {
        return i + 1;
      }
    }

    return 1;
  });

  let dialogUnlock: AbilityUnlockDto | undefined = $state();

  let abilityDescriptionDialogOpen = $state(false);

  let confirmDeselectDialogOpen = $state(false);

  let resetLevel: number | undefined = $state();

  let { mainPowerLevels, multiPowerLevels }: Props = $props();

  let page = $state(0);

  let activesContainer: HTMLDivElement | undefined = $state();

  let passivesContainer: HTMLDivElement | undefined = $state();

  let activesCy: cytoscape.Core | undefined = $state();

  let passivesCy: cytoscape.Core | undefined = $state();

  onMount(() => {
    $effect(() => {
      if (activesContainer) {
        const actives = currentTable.map((l) => l.active);
        activesCy = makeCy(actives, activesContainer);
      }

      if (passivesContainer) {
        const passives = currentTable.map((l) => l.passive);
        passivesCy = makeCy(passives, passivesContainer);
      }
    });
  });

  let currentTable = $derived(page === 0 ? mainPowerLevels : (multiPowerLevels ?? mainPowerLevels));

  $effect(() => {
    if (!selectedMulticlass) {
      page = 0;
    }
  });

  $effect(() => {
    void page;

    document.querySelectorAll('.node-popper').forEach((n) => n.classList.add('hidden'));
  });

  function makeCy(abilities: AbilityUnlockDto[][], el: HTMLDivElement) {
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

    const cy = cytoscape({
      container: el,
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
            'outline-width': 6,
            'outline-color': function (node) {
              const unlock: AbilityUnlockDto | undefined = node.data('unlock');

              const selected = node.data('selected');
              if (selected && unlock && unlock.minimumPowerLevel <= currentPowerLevel) {
                return 'green';
              }
              return 'gray';
            },
            'outline-opacity': function (node) {
              const selected = node.data('selected');
              if (selected) {
                return 1;
              }
              return 0.5;
            },
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

    untrack(() => {
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
          n.data('selected', true);
        } else {
          n.data('selected', false);
        }

        if (unlock.requiredAbility) {
          const parentPos = tree.positions.get(unlock.requiredAbility.id);
          const parent = selectedAbilities.find((a) => a.id === unlock.requiredAbility!.id);

          if ((!parentPos || parentPos.row !== 0) && !parent) {
            toggleNodeIcon(n, true);
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
            abilityDescriptionDialogOpen = true;
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
    });

    $effect(() => {
      cy.nodes().forEach((n) => {
        const id = n.id();

        const unlock: AbilityUnlockDto | undefined = n.data('unlock');
        if (!unlock) {
          return;
        }

        const nodeIsSelected: boolean | undefined = n.data('selected');

        const abilityShouldBeSelected = !!selectedAbilities.find((a) => a.id === id);

        if (
          unlock.style === UnlockStyle.AutoGrant ||
          (abilityShouldBeSelected && !nodeIsSelected)
        ) {
          n.data('selected', true);
        } else if (!abilityShouldBeSelected && nodeIsSelected) {
          const pos = tree.positions.get(id);
          if (pos?.row !== 0) {
            n.data('selected', false);
          }
        }

        if (unlock.minimumPowerLevel > currentPowerLevel) {
          toggleNodeIcon(n, true);
        }

        if (unlock.minimumPowerLevel <= currentPowerLevel) {
          toggleNodeIcon(n, false);
        }

        if (selectedMulticlass) {
          const shouldSelectMulticlass = currentLevelPoints === 2 && usedPoints === 1;

          const shouldSelectMainClass = currentLevelPoints === 2 && usedPoints == 0;

          if (
            shouldSelectMulticlass &&
            page === 0 &&
            !abilityShouldBeSelected &&
            unlock.minimumPowerLevel !== 0
          ) {
            toggleNodeIcon(n, true);
          }

          if (
            shouldSelectMainClass &&
            page === 1 &&
            !abilityShouldBeSelected &&
            unlock.minimumPowerLevel !== 0
          ) {
            toggleNodeIcon(n, true);
          }
        }
      });
    });

    $effect(() => {
      if (context.currentLevel === 21) {
        cy.nodes('node[?icon]').forEach((n) => {
          const id: string = n.data('id');

          const isSelected = !!selectedAbilities.find((a) => a.id === id);

          if (!isSelected) {
            toggleNodeIcon(n, true);
          }
        });
      }

      if (context.currentLevel === 20) {
        cy.nodes('node[?icon]').forEach((n) => {
          const unlock: AbilityUnlockDto | undefined = n.data('unlock');
          if (!unlock) {
            return;
          }

          const isSelected = !!selectedAbilities.find((a) => a.id === unlock.requiredAbility?.id);

          if (!unlock.requiredAbility || isSelected) {
            toggleNodeIcon(n, false);
          }
        });
      }
    });

    return cy;
  }

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
    const index = selectedAbilities.findIndex((a) => a.id === id);

    const deleteCount = selectedAbilities.length - index;

    selectedAbilities.splice(index, deleteCount);
  }

  function select(id: string, node: NodeSingular, cy: cytoscape.Core) {
    const unlock: AbilityUnlockDto = node.data('unlock');
    if (!unlock || context.currentLevel === 21) {
      return false;
    }

    const subtree: Subtree = node.data('subtree');

    const level: number = node.data('level');
    if (multiPowerLevels && level > 7) {
      return false;
    }

    if (unlock.minimumPowerLevel > currentPowerLevel) {
      return false;
    }

    if (page === 0 && selectedMulticlass && currentLevelPoints === 2 && usedPoints === 1) {
      return false;
    }

    if (unlock.requiredAbility) {
      const parent = selectedAbilities.find((a) => a.id === unlock.requiredAbility!.id);
      if (subtree.parent && subtree.parent.level !== 0 && !parent) {
        return false;
      }
    }

    if (unlock.mutuallyExclusive && subtree.parent) {
      for (const d of subtree.parent.descendants) {
        const siblingId = d.node.addedAbility!.id;
        const sibling = selectedAbilities.find((a) => a.id === siblingId);

        if (sibling && siblingId !== id) {
          return false;
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

      if (unlock.minimumPowerLevel > currentPowerLevel) {
        continue;
      }

      if (unlock.requiredAbility?.id === id) {
        toggleNodeIcon(n, false);
      }
    }

    return true;
  }

  function toggleSelected(id: string, node: NodeSingular, cy: cytoscape.Core) {
    const exists = selectedAbilities.find((a) => a.id === id);

    const unlock: AbilityUnlockDto = node.data('unlock');
    if (unlock.style === UnlockStyle.AutoGrant) {
      return;
    }

    if (exists) {
      const ability = selectedAbilities.find((a) => a.id === id);

      if (!ability) {
        return;
      }

      if (ability.level === context.currentLevel) {
        --usedPoints;
        deselect(id, node, cy);
      } else {
        resetLevel = ability.level;
        confirmDeselectDialogOpen = true;
      }
    } else {
      const result = select(id, node, cy);
      if (result) {
        selectedAbilities.push({ level: context.currentLevel, id });

        ++usedPoints;

        if (selectedMulticlass && currentLevelPoints === 2) {
          page = 1;
        }

        if (usedPoints === currentLevelPoints) {
          usedPoints = 0;
          ++context.currentLevel;
        }
      }
    }
  }

  function resetToLevel(level: number) {
    const index = selectedAbilities.findIndex((a) => a.level === level);

    const toRemove = selectedAbilities.splice(index);

    context.currentLevel = level;
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
</script>

<Dialog.Root bind:open={abilityDescriptionDialogOpen}>
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
<Dialog.Root bind:open={confirmDeselectDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm deselect</Dialog.Title>
    </Dialog.Header>
    Deselecting this ability will reset your level to {resetLevel}. Are you sure?
    <Dialog.Footer>
      <Dialog.Close onclick={() => resetToLevel(resetLevel!)}>Ok</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
<div>
  <div class="px-2 flex flex-col p-0 m-0 pb-4">
    <div class="flex flex-row gap-3">
      <div>
        <p>Current level: {Math.min(context.currentLevel, 20)}</p>
        {#if currentLevelPoints === 2}
          <p>
            New power level unlocked!
            {#if selectedMulticlass}
              {usedPoints === 0 ? 'Select main class ability.' : 'Select multiclass ability.'}
            {:else}
              Available points: {currentLevelPoints - usedPoints}
            {/if}
          </p>
        {:else}
          <p>
            Available points:
            {#if context.currentLevel === 21}
              -
            {:else}
              {currentLevelPoints - usedPoints}
            {/if}
          </p>
        {/if}
      </div>
    </div>
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
  <div
    class="flex flex-row w-full max-md:w-[300] overflow-x-auto overscroll-contain bg-[repeating-linear-gradient(#9e8c6e,#9e8c6e_10%,#ccb899_10%,#ccb899_20%)]"
  >
    <div
      id="cytoscape-actives"
      class="h-[50dvh] w-200 block shrink-0"
      bind:this={activesContainer}
    ></div>
    <div
      id="cytoscape-passives"
      class="h-[50dvh] w-300 block shrink-0"
      bind:this={passivesContainer}
    ></div>
  </div>
</div>
