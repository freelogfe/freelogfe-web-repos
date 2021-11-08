export function textOverflowEllipsis(str: string, len: number = 20) {
  return str.length > len ? str.slice(0, len) + '...' : str;
}
