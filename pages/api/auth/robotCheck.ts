import type { NextApiRequest, NextApiResponse } from 'next';
import memoryCache, { CacheClass } from 'memory-cache';

export interface CaptchaResponse {
    success: boolean;
    challenge_ts: Date;
    hostname: string;
}

export const memCache: CacheClass<string, string> = new memoryCache.Cache();

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST')
        return res.status(405).json({ error: 'ERR_INVALID_METHOD' });
    const { requestId } = req.body;
    if (!requestId) {
        res.status(400).json({ error: 'ERR_POST_DATA' });
        return;
    }
    const value = memCache.get(requestId);
    if (value === 'ok') {
        res.status(200).json({ success: true });
        return;
    }


    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY as string}&response=${requestId}&remoteip=user_ip_address`;

    const response = await fetch(url);
    if (response.status === 200) {
        const json = await response.json() as CaptchaResponse;
        const cacheTime= 1000 * 60;
        if (json.success) {
            res.status(200).json({ success: true });
            memCache.put(requestId, 'ok', cacheTime );
        }
        else
            res.status(400).json({ error: 'ERR_INVALID_CAPTCHA'  });
    }
    else
        return res.status(503).json({ error: 'ERR_SERVICE_UNAVAILABLE' });

};

export default Handler;