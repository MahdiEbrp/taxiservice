import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import getPersonel from '../../../lib/getPersonel';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem } from '../../../lib/validator';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });
    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const email = session.user.email;
    const { ids } = <{ ids: string[]; }>req.body;

    if (arrayHasNullOrEmptyItem(ids))
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });
        await prisma.personel.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                isRequest: false
            }
        });
        const personel = await getPersonel(email);
        if (!personel)
            return res.status(200).json({ ids: [] });
        const userIds = personel.map((p) => p.id);

        return res.status(200).json({ ids: userIds });

    }
    catch (error) {
        if (error instanceof Error)
            log.error(error.message);
        else
            log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
