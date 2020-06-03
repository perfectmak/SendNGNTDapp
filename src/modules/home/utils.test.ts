import { toBaseUnit, fromBaseUnit, extractQrCodeAddress } from './utils';

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

describe('extractQrCodeAddress', () => {
  it('should extract simple address', () => {
    const expectedAddress = '0x22D9dD563DE7717708D20aed3923FCb9445cdD58';
    const result = extractQrCodeAddress(expectedAddress);

    expect(result).toEqual(expectedAddress);
  });

  it('should extract standard format address', () => {
    const expectedAddress = '0x22D9dD563DE7717708D20aed3923FCb9445cdD58';
    const result = extractQrCodeAddress(`ethereum:${expectedAddress}`);

    expect(result).toEqual(expectedAddress);
  });
});
