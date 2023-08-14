// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import _ from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(1000);
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(1000);
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(1000);
    const account2 = getBankAccount(1000);
    expect(() => account1.transfer(2000, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account1 = getBankAccount(1000);
    expect(() => account1.transfer(500, account1)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(1000);
    account.deposit(500);

    expect(account.getBalance()).toBe(1500);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000);
    account.withdraw(600);
    expect(account.getBalance()).toBe(400);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(1000);
    const account2 = getBankAccount(1000);
    account1.transfer(600, account2);
    expect(account1.getBalance()).toBe(400);
    expect(account2.getBalance()).toBe(1600);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(1000);
    const spyRandom = jest.spyOn(_, 'random');
    spyRandom.mockReturnValueOnce(60);
    spyRandom.mockReturnValueOnce(1);

    const balance = await account.fetchBalance();
    expect(balance).toBe(60);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(1000);
    const spyRandom = jest.spyOn(_, 'random');
    spyRandom.mockReturnValueOnce(60);
    spyRandom.mockReturnValueOnce(1);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(60);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(1000);
    const spyRandom = jest.spyOn(_, 'random');
    spyRandom.mockReturnValueOnce(60);
    spyRandom.mockReturnValueOnce(0);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
