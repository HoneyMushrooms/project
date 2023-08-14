// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 0.1, b: 0.2, action: Action.Add, expected: 0.3 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 0.1, b: 0.2, action: Action.Subtract, expected: -0.1 },
  { a: 1, b: 2, action: Action.Multiply, expected: 2 },
  { a: 0.1, b: 0.2, action: Action.Multiply, expected: 0.02 },
  { a: 1, b: 2, action: Action.Divide, expected: 0.5 },
  { a: 0.1, b: 0.2, action: Action.Divide, expected: 0.5 },
  { a: 1, b: 2, action: Action.Exponentiate, expected: 1 },
];

const testCasesNull = [
  { a: '0.1', b: 0.2, action: Action.Divide },
  { a: 0.1, b: 0.2, action: '%' },
];

describe('simpleCalculator', () => {
  test.each(testCases)('testing the pack %s', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBeCloseTo(expected);
  });

  test.each(testCasesNull)('testing the pack %s', ({ a, b, action }) => {
    expect(simpleCalculator({ a, b, action })).toBeNull();
  });
});
