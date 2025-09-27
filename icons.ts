import fs from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import sharp from 'sharp';

interface Atlas {
	m_Structure: {
		sprites: {
			name: string;
			outer: {
				x: number;
				y: number;
				width: number;
				height: number;
			};
		}[];
	};
}

async function main() {
	const argv = yargs(hideBin(process.argv))
		.options({
			spriteSheet: {
				type: 'string',
				demandOption: true,
				description: 'Path to the sprite sheet',
				alias: 's',
			},
			atlas: {
				type: 'string',
				demandOption: true,
				description: 'Path to the atlas file',
				alias: 'a',
			},
			output: {
				type: 'string',
				default: './static/icons',
				description: 'Path to the output directory',
				alias: 'o',
			},
		})
		.parseSync();

	const { spriteSheet, atlas, output } = argv;

	try {
		await fs.mkdir(output, { recursive: true });

		const sharpInstance = sharp(spriteSheet).png();

		const atlasData = await fs.readFile(atlas, 'utf-8');
		const parsedAtlas = JSON.parse(atlasData) as Atlas;

		parsedAtlas.m_Structure.sprites.forEach(async (sprite) => {
			const { name, outer } = sprite;
			const { x, y, width, height } = outer;

			const outputPath = `${output}/${name}.png`;

			await sharpInstance
				.clone()
				.extract({ left: x, top: y, width, height })
				.toFile(outputPath);

			console.log(`Wrote ${outputPath}`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

main();
