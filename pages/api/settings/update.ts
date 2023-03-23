import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';
import { arrayHasNullOrEmptyItem } from '../../../lib/validator';


const Handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });

    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const { localization, profilePicture } = <{ localization: string, profilePicture: string; }>req.body;
    const {accountType} = <{accountType: number}>req.body;
    let { name } = <{ name: string; }>req.body;

    const isValid = !arrayHasNullOrEmptyItem([name, localization, profilePicture]);
    if (!isValid)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    const email = session.user.email;
    const maxNameLength = 300;

    name = name.trim().substring(0, maxNameLength);

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });

        const agency = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                name: name,
                localization: localization,
                profilePicture: profilePicture,
                accountType: accountType,
                settingUpdateDate: new Date()
            }
        });
        if (!agency)
            return res.status(404).json({ error: 'ERR_AGENCY_NOT_FOUND' });
        else
            return res.status(200).end();
    } catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_INTERNAL_SERVER_ERROR' });
    }
};
export default Handler;
