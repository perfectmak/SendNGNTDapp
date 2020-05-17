import { toBaseUnit, fromBaseUnit } from './utils';

describe('toBaseUnit', () => {
  it('should work', () => {
    expect(toBaseUnit('100', 2).toString()).toEqual('10000');
  });
});

describe('fromBaseUnit', () => {
  it('should work', () => {
    expect(fromBaseUnit('10010', 2).toString()).toEqual('100.1');
  });
});
