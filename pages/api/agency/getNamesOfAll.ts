import { NextApiRequest, NextApiResponse } from 'next';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {


    if (req.method !== 'GET')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });

    try {
        const prisma = prismaClient;

        const agency = await prisma.agency.findMany({
            select: {
                agencyName: true,
            }
        });

        if (!agency)
            return res.status(404).json({ error: 'ERR_AGENCY_NOT_FOUND' });
        return res.status(200).json(agency);
    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;
