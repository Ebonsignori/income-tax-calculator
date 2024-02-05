export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function snakeToTitleCase(snakeCase: string) {
  return snakeCase.replace(/^_*(.)|_+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase(),
  );
}

export function toSnakeCase(anyCase: string): string {
  const snakeCase = anyCase
    ?.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
    )
    ?.map((s: string) => s.toLowerCase())
    .join("_");
  return snakeCase || anyCase;
}

export function yearDisplay(year: string) {
  return `${year} - ${parseInt(year, 10) + 1}`;
}
