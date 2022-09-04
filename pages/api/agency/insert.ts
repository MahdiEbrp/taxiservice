import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import memoryCache, { CacheClass } from 'memory-cache';

export const memCache: CacheClass<string, string> = new memoryCache.Cache();

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const { agencyName, password } = req.body;

    const email = session.user.email;
    const cacheTime = 1000 * 60;
    const value = memCache.get(email);

    if (value !== null)
        return res.status(429).json({ error: 'ERR_TOO_MANY_REQUESTS' });

    memCache.put(email, 'ok', cacheTime);
    res.status(200).json({ name: email || '' });

};

export default Handler;