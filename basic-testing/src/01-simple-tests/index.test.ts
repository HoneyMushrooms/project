// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    // Write your test here
    expect(simpleCalculator({ a: 2, b: 3, action: Action.Add })).toBeCloseTo(5);
  });

  test('should subtract two numbers', () => {
    // Write your test here
    expect(
      simpleCalculator({ a: 2, b: 3, action: Action.Subtract }),
    ).toBeCloseTo(-1);
  });

  test('should multiply two numbers', () => {
    // Write your test here
    expect(
      simpleCalculator({ a: 2, b: 3, action: Action.Multiply }),
    ).toBeCloseTo(6);
  });

  test('should divide two numbers', () => {
    // Write your test here
    expect(simpleCalculator({ a: 6, b: 3, action: Action.Divide })).toBeCloseTo(
      2,
    );
  });

  test('should exponentiate two numbers', () => {
    // Write your test here
    expect(
      simpleCalculator({ a: 2, b: 3, action: Action.Exponentiate }),
    ).toBeCloseTo(8);
  });

  test('should return null for invalid action', () => {
    // Write your test here
    expect(simpleCalculator({ a: 2, b: 3, action: '%' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    // Write your test here
    expect(
      simpleCalculator({ a: 2, b: 'sad', action: Action.Exponentiate }),
    ).toBeNull();
  });
});
