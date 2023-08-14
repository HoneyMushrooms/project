// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios')

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  test('should create instance with provided base url', async () => {

    (axios.create as jest.Mock).mockReturnValue({get: () => ({data: {test: 'Test'}})})

    await throttledGetDataFromApi('api');
    expect(axios.create).toHaveBeenCalledWith({baseURL: 'https://jsonplaceholder.typicode.com'})
  });

  test('should perform request to correct provided url', async () => {
    // Write your test here
  });

  test('should return response data', async () => {
    (axios.create as jest.Mock).mockReturnValue({get: jest.fn().mockResolvedValue({data: {test: 'Test'}})})

    await expect(throttledGetDataFromApi('api')).resolves.toEqual({test: 'Test'});
  });
});
