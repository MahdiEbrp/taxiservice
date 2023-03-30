import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import { Sh256Encrypt } from '../../../lib/encryption';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem, isPasswordValid } from '../../../lib/validator';


const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });

    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const { currentPassword, newPassword } = < { currentPassword: string, newPassword: string; } > req.body;

    const isValid = !arrayHasNullOrEmptyItem([currentPassword, newPassword]);
    if (!isValid)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    if (currentPassword === newPassword)
        return res.status(400).json({ error: 'ERR_SAME_PASSWORD' });
    if (!isPasswordValid(newPassword) || !isPasswordValid(currentPassword))
        return res.status(400).json({ error: 'ERR_INVALID_PASSWORD' });

    const email = session.user.email;
    const encryptedCurrentPassword = Sh256Encrypt(currentPassword, process.env.ENCRYPTION_PASSWORD_SALT as string);
    const encryptedNewPassword = Sh256Encrypt(newPassword, process.env.ENCRYPTION_PASSWORD_SALT as string);

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });
        if (user.password !== encryptedCurrentPassword)
            return res.status(401).json({ error: 'ERR_INVALID_PASSWORD' });

        const update = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: encryptedNewPassword
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
