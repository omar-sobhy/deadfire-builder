# Pillars of Eternity Builder

A character builder for the Obsidian game Pillars of Eternity II: Deadfire.

Live demo at https://deadfire.omarsobhy.dev.

### Requirements

This is a SvelteKit project, so Node.js is required. It can most easily be installed using [nvm](https://github.com/nvm-sh/nvm).

After Node.js is installed, dependencies should be fetched using `npm install`.

### Development

#### Icons

The app requires in-game icons which can't be distributed with this source. Therefore, they must be manually extracted from the game. I was able to do this using [AssetRipper](https://github.com/AssetRipper/AssetRipper).

> [!IMPORTANT]
> If using `AssetRipper`, it is possible that more than just `sharedassets2.assets` needs to be loaded for the below instructions. The instructions were tested with the entire game being loaded (starting from the root `Pillars of Eternity II` directory), but it's possible the scope can be limited. Unfortunately, this requires a lot of memory (around 3.5GB) and takes some time (10+ minutes on my machine) to process. Grab a coffee and let it run for a few minutes.

The file that contains the icons is `sharedassets2.assets` found at `<Steam library path>/Pillars of Eternity II/PillarsOfEternityII_Data`. After opening the file in AssetRipper, we are interested in two paths: 112 under `Sprite Data Storage`, which contains a sprite sheet of all the spell and ability icons, and 641 under `sharedassets2.assets`, which contains the name and coordinates of each icon in the sprite sheet.

We also need the game system icons sprite sheet located at path 145 under `Sprite Data Storage` and the atlas located at path `632` under `sharedassets2.assets`.

A utility script is provided to help with splicing the sprite sheet into individual icons. Run

```sh
npm run icons -- -s <path to sprite sheet> -a <path to atlas>

# example with actual paths
npm run icons -- -s ./SpellAbilityIcons.png -a ./SpellAbilityIconsAtlas.json
npm run icons -- -s ./GameSystemIcons.png -a ./GameSystemIconsAtlas.json
```

Note the extra `--` after the `npm run icons` command.

#### Parsing game data

Parsed game data will also need to extracted from the game files. `AssetRipper` is not needed for this; simply copy all the folders in `<Steam library path>/Pillars of Eternity II/PillarsOfEternityII_Data` with `exported` in their name to a convenient place, then run

```sh
npm run parse -- -i <path to gamedata directory>

# example with actual paths
npm run parse -- -i ./gamedata
```

Note the extra `--` after the `npm run parse` command.

#### Running the application

The development server can be started with:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.
