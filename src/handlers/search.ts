import fetch from 'node-fetch';
import {Response, Request} from 'express';
import parse from 'parse-link-header';

import {User} from '../entities/user';

// GET /users
export const search = async (req: Request, res: Response): Promise<void> => {
  if (!req.query.lang) {
    return res.status(400).end();
  }

  const page = req.query.p ? `&page=${req.query.p}` : '';
  const url = `https://api.github.com/search/users?q=language:${req.query.lang}${page}`;

  const userUrls: string[] = [];
  const users: User[] = [];
  let links: parse.Links;

  // TODO: Caching.
  const data = await fetch(url);

  if (data.status !== 200) {
    return res.status(502).end();
  }

  const json = await data.json();

  userUrls.push(...json.items.map((i: { url: string }) => i.url));

  if (data.headers.get('link')) {
    links = parse(data.headers.get('link'));
  }

  const response = {
    data: users,
    incomplete: false,
    ...links && {
      next: `/users?lang=${req.query.lang}&p=${links.next.page}`,
    },
  };

  await Promise.all(userUrls.map(async url => {
    const data = await fetch(url);
    if (data.status === 200) {
      const json = await data.json();
      response.data.push(new User(json));
    } else {
      // In case we hit a rate limit
      // (https://developer.github.com/v3/search/#rate-limit).
      response.incomplete = true;
    }
  }));

  res.json(response);
};
