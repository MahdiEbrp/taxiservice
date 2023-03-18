import prismaClient from '../../../lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import { arrayHasNullOrEmptyItem } from '../../../lib/validator';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });
    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });

    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const { users } = <{ users: string[]; }>req.body;
    let { title, message } = <{ title: string, message: string; }>req.body;

    const isValid = !arrayHasNullOrEmptyItem([]);
    if (!isValid)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });

    const email = session.user.email;

    const maxTitleLength = 50;
    const maxMessageLength = 300;

    message = message.trim().substring(0, maxMessageLength);
    title = title.trim().substring(0, maxTitleLength);

    try {
        const prisma = prismaClient;

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });

        const usersTo = await prisma.user.findMany({
            where: {
                id: {
                    in: users
                }
            }
        });

        if (usersTo.length === 0)
            return res.status(404).json({ error: 'ERR_USERS_NOT_FOUND' });

        await prisma.message.createMany({
            data: users.map((id) => {
                return {
                    title: title,
                    message: message,
                    createdAt: new Date(),
                    isRead: false,
                    senderId: user.id,
                    userId: id
                };
            })
        });

        res.status(200).json({ message: 'OK' });

    }
    catch (e) {
        log.error(JSON.stringify(e));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};



export default Handler;