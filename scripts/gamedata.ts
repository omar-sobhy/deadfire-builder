import fs from 'node:fs';
import path from 'node:path';

const dir = fs.readdirSync('./raw', { withFileTypes: true });

fs.mkdirSync('formatted');

dir.forEach((d) => {
  if (!d.name.endsWith('gamedatabundle')) {
    console.log(
      `Skipping file ${d.name} because it doesn't have a .gamedatabundle extension...`,
    );
  }

  const name = d.name.split('.')[0] + '.json';

  const inputFilePath = path.join(d.parentPath, d.name);

  fs.readFile(inputFilePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      try {
        const parsed = JSON.parse(data.replace(/\ufeff/g, ''));
        const formatted = JSON.stringify(parsed, undefined, 2);

        const outputFilePath = path.join('formatted', name);

        fs.writeFile(
          outputFilePath,
          formatted,
          { encoding: 'utf-8' },
          (err) => {
            if (err) {
              console.error(err);
            }
          },
        );
      } catch (error) {
        console.error(`Error while parsing ${name}`);
        console.error(error);
      }
    }
  });
});
