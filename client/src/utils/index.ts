import { getComponentValue } from "@latticexyz/recs";

export const FIXED_SIZE: bigint = 42535295865117307932921825928971026432n; // 2^125
export const ONE: bigint = 18446744073709551616n; // 2^61
export const PRIME: bigint =
  3618502788666131213697322783095070105623107215331596699973092056135872020481n;
export const PRIME_HALF: bigint = PRIME / 2n;

export function isValidArray(input: any): input is any[] {
  return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(
  entities: any[] | null | undefined,
  typename: string
): any | null {
  if (!isValidArray(entities)) return null;

  for (let entity of entities) {
    if (isValidArray(entity?.node.components)) {
      const foundComponent = entity.node.components.find(
        (comp: any) => comp.__typename === typename
      );
      if (foundComponent) return foundComponent;
    }
  }

  return null;
}

export function extractAndCleanKey(
  entities?: any[] | null | undefined
): string | null {
  if (!isValidArray(entities) || !entities[0]?.keys) return null;

  return entities[0].keys.replace(/,/g, "");
}

export function hexToAscii(hex: string) {
  var str = "";
  for (var n = 2; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export const toFelt = (num: number | bigint): bigint => BigInt(num);

export const toFixed = (num: number | bigint): bigint => {
  const res: bigint = BigInt(num) * ONE;
  if (res > FIXED_SIZE || res <= FIXED_SIZE * -1n)
    throw new Error("Number is out of valid range");
  return toFelt(res);
};

export const fromFixed = (num: bigint): number => {
  let res: bigint = BigInt(num);
  res = res > PRIME_HALF ? res - PRIME : res;
  const int: number = Number(res / ONE);
  const frac: number = Number(res % ONE) / Number(ONE);
  return int + frac;
};

export class Fixed {
  mag: number;
  sign: number;
  size: number;

  constructor(mag: number, sign: number, size: number = 64) {
    if (![64, 128].includes(size))
      throw new Error("Invalid size. Must be 64 or 128");
    this.mag = mag;
    this.sign = Number(sign);
    this.size = size;
  }

  static toFixed(input: number | [number, number], size: number = 64): Fixed {
    if (Array.isArray(input)) return new Fixed(input[0], input[1], size);
    return new Fixed(input, 0, size); // Here I've assumed sign as 0, you might need to change this based on your actual requirements.
  }

  valueOf(): number {
    const _value: number = this.mag / 2 ** (this.size === 64 ? 32 : 64);
    return this.sign ? -_value : _value;
  }
}

///////////////////////////////////////////////////
//THESE ARE ALL TO CHECK AND MAYBE REMOVE LATER

export function bigIntToHexAndAscii(value: bigint): string {
  const hexString = value.toString(16);
  let asciiString = "";

  for (let i = 0; i < hexString.length; i += 2) {
    const hexChar = hexString.substr(i, 2);
    const decimalValue = parseInt(hexChar, 16);
    asciiString += String.fromCharCode(decimalValue);
  }

  return asciiString;
}

export function bigIntToHexWithPrefix(value: bigint | number): string {
  const hexString = `0x${value.toString(16)}`;
  return hexString;
}

