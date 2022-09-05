const map = {
  C: 6,
  M: 2,
  L: 2,
  V: 1,
  H: 1,
  Z: 0,
} as const;

type FuncType = keyof typeof map;
const funcs = Object.keys(map) as FuncType[];

export type Group = [FuncType, ...string[]];

export const groupfy = (parsed: string) => {
  const splitted = parsed.split(' ');
  const grouped: Group[] = [];

  for (let i = 0; i < splitted.length; i++) {
    const current = splitted[i];

    if (funcs.includes(current as any)) {
      const length = map[current as FuncType];
      const values = Array.from({ length }, (_, idx) => splitted[i + 1 + idx]);

      if (current === 'V') {
        const [prevX] = getPrevPosition(grouped[grouped.length - 1]);
        grouped.push(['L', prevX, ...values]);
      } else if (current === 'H') {
        const [, prevY] = getPrevPosition(grouped[grouped.length - 1]);
        grouped.push(['L', ...values, prevY]);
      } else {
        grouped.push([current as FuncType, ...values])
      }

      i = i + length;
    }
  }

  return grouped;
};

type Position = [string, string];
const getPrevPosition = (group: Group): Position => {
  switch (group.length) {
    case 7:
      return group.slice(5) as Position;
    default:
      return group.slice(1) as Position;
  }
};

type Attrs = Pick<CanvasRenderingContext2D, 'fill' | 'stroke'>;

export const writeLine = (group: Group) => {
  const [funcType, ...position] = group;
  const floatted = position.map(parseFloat).join(', ');

  switch (funcType) {
    case 'C': 
      return `context.bezierCurveTo(${floatted});`;
    case 'M':
      return `context.moveTo(${floatted});`;
    case 'L':
      return `context.lineTo(${floatted});`;
    case 'Z':
      return '';
  }
};

type DrawPathParams = {
  groups: Group[],
} & Partial<Attrs>;

export const drawPath = ({ groups, fill, stroke }: DrawPathParams) => {
  const result = [
    'context.beginPath();',
    ...groups.map(writeLine),
  ];

  fill && result.push(`context.fillStyle = '${fill}';`, 'context.fill();');
  stroke && result.push(`context.strokeStyle = '${stroke}';`, 'context.stroke();');

  return result.concat(['context.closePath();']).join('\n');
};
