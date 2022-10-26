import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem, isEmailValid } from '../../../lib/validator';


const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });

    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const { currentEmail, newEmail } = < { currentEmail: string, newEmail: string; } > req.body;

    const isValid = !arrayHasNullOrEmptyItem([currentEmail, newEmail]);
    if (!isValid)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    if (currentEmail === newEmail)
        return res.status(400).json({ error: 'ERR_SAME_EMAIL' });
    if (!isEmailValid(newEmail) || !isEmailValid(currentEmail))
        return res.status(400).json({ error: 'ERR_INVALID_EMAIL' });

    const email = session.user.email;
    if (email !== currentEmail)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED_EMAIL' });

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });

        const emailExists = await prisma.user.findFirst({
            where: {
                email: newEmail
            }
        });
        if (emailExists)
            return res.status(400).json({ error: 'UNACCEPTABLE_EMAIL' });

        const update = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                email: newEmail
            }
        });
        if (!update)
            return res.status(404).json({ error: 'ERR_UPDATE_FAILS' });
        else
            return res.status(200).end();
    } catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_INTERNAL_SERVER_ERROR' });
    }
};
export default Handler;
