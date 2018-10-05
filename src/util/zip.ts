export function zip(...arrays: any[]): any[] {
  return arrays[0].map((_: any, index: number) => arrays.map(array => array[index]));
}
