import fs from 'fs/promises';
import parse from './parse';
import { groupfy, drawPath } from './utils';

const main = async () => {
  const filePaths = process.argv.slice(2);
  const fileNames = filePaths.map((path) => {
    const matched = path.match(/^[\w\s\d-_./]*\/(?<name>[\w\s\d-_]+).svg/);
    return matched?.groups ? matched.groups.name : '';
  });
  const files = await Promise.all(
    filePaths.map(
      (path) => fs.readFile(path, { encoding: 'utf-8'}),
    ),
  );
  const parseds = files.map(parse);
  const grouped = parseds.map(
    (parsed) => parsed.map(({ d, ...attr }) => ({
      d,
      dGroups: groupfy(d),
      ...attr,
    })),
  );
  const lines = grouped.map(
    (parsed) => parsed.map(
      ({ d, dGroups, ...attr }) => drawPath({
        groups: dGroups,
        ...attr,
      } as any),
    ).join('\n\n'),
  );

  await fs.mkdir('./result', { recursive: true });
  await Promise.all(
    lines.map((line, idx) => fs.writeFile(
      `./result/${fileNames[idx]}.txt`,
      line,
      { encoding: 'utf-8' },
    )),
  );
};

main();
