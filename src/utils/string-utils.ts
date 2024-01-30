export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function snakeToTitleCase(snakeCase: string) {
  return snakeCase.replace(/^_*(.)|_+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase()
  );
}

export function yearDisplay(year: string) {
  return `${year} - ${parseInt(year, 10) + 1}`;
}
