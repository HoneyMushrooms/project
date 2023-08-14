// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', async () => {
    const callback = jest.fn();
    const spySetTimeout = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 1000);

    expect(spySetTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spySetInterval = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 1000);

    expect(spySetInterval).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    //for(let i = 0; i < 4; i++) jest.runOnlyPendingTimers();

    jest.advanceTimersByTime(1000 * 4);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spyJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously('pathToFile');
    expect(spyJoin).toHaveBeenCalledWith(expect.any(String), 'pathToFile');
  });

  test('should return null if file does not exist', async () => {
    const spyExistsSync = jest.spyOn(fs, 'existsSync');
    spyExistsSync.mockReturnValue(false);

    await expect(readFileAsynchronously('pathToFile')).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const spyExistsSync = jest.spyOn(fs, 'existsSync');
    const spyReadFile = jest.spyOn(fsPromises, 'readFile');

    spyExistsSync.mockReturnValue(true);
    spyReadFile.mockResolvedValue('text');

    await expect(readFileAsynchronously('pathToFile')).resolves.toBe('text');
  });
});
