import request from 'supertest';
import fetch from 'node-fetch';

import server from '../server';

jest.mock('node-fetch');

describe('GET /users', () => {
  beforeEach(() => jest.resetAllMocks());

  afterEach(() => {
    server.close();
  });

  test('should fail if no language was specified', async () => {
    (fetch as any).mockResolvedValue({
      headers: {get: (): string => ''},
      status: 200,
      json: () => Promise.resolve({items: [{
        id: 905434,
        url: 'https://api.github.com/users/ruanyf',
      }], total_count: 2074951}),
    });
    const response = await request(server).get('/users');
    expect(response.status).toEqual(400);
    expect(response.body.data).toBeUndefined();
  });

  test('should fail if upstream API made a boo-boo', async () => {
    (fetch as any).mockResolvedValue({status: 500});
    const response = await request(server).get('/users?lang=ocaml');
    expect(response.status).toEqual(502);
    expect(response.body.data).toBeUndefined();
  });

  test('should return a list of users', async () => {
    const headers = {
      get: (): string => '<https://api.github.com/search/users?q=language%3Apascal&page=2>; rel="next", <https://api.github.com/search/users?q=language%3Apascal&page=34>; rel="last"',
    };

    const users = { items: [{
      id: 905434,
      login: 'ruanyf',
      url: 'https://api.github.com/users/ruanyf',
    }, {
      id: 810438,
      login: 'gaearon',
      url: 'https://api.github.com/users/gaearon',
    }], total_count: 2074951 };

    const user = {
      headers: { get: (): string => '' },
      status: 200,
      json: () => Promise.resolve({
        avatar_url: 'https://avatars0.githubusercontent.com/u/905434?v=4',
        bio: null,
        login: 'ruanyf',
        name: 'Ruan YiFeng',
        followers: 51305,
        following: 0,
        type: 'User',
        updated_at: '2019-04-14T14:52:27Z',
        url: 'https://api.github.com/users/ruanyf',
      }),
    };

    (fetch as any)
      .mockResolvedValueOnce({
        headers,
        status: 200,
        json: () => Promise.resolve(users),
      })
      .mockResolvedValue(user);
    const response = await request(server).get('/users?lang=javascript');
    expect(fetch).toHaveBeenCalledTimes(users.items.length + 1);
    expect(response.status).toEqual(200);
    expect(response.body.data).toMatchSnapshot();
  });
});
