import { zip } from './zip';

describe('zip', () => {
  it('zips two arrays correctly', async function() {
    const arrays = [[1, 2, 'one', 'two'], [3, 4, 'three', 'four'], [0, 0, 'zero', 'zero']];
    const expected = [[1, 3, 0], [2, 4, 0], ['one', 'three', 'zero'], ['two', 'four', 'zero']];
    const actual = zip(...arrays);
    expect(actual).toEqual(expected);
  });

  it('reverses correctly', async function() {
    const expected = [[1, 2, 'one', 'two'], [3, 4, 'three', 'four'], [0, 0, 'zero', 'zero']];
    const actual = zip(...zip(...expected));
    expect(actual).toEqual(expected);
  });
});
