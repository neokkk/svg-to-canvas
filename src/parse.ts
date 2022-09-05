export const paths = (raw: string) => {
  const tags = raw.match(/\<path d="[\d\w\s.-]+"[\d\w\s"-=#]*\/>/g)!;

  return tags.map((tag) => {
    const [, d = ''] = tag.match(/d="([\d\w\s.-]+)"/) || [];
    const [, fill = ''] = tag.match(/fill="(#[\d\w]+)"/) || [];
    const [, stroke = ''] = tag.match(/stroke="(#[\d\w]+)"/) || [];

    return {
      d: space(d),
      fill,
      stroke,
    };
  });
};

const space = (path: string) =>
  path
    .replaceAll(/([CLMVHZ])/g, ' $1 ')
    .trimStart()
    .trimEnd();

const parse = (raw: string) => paths(raw);

export default parse;
