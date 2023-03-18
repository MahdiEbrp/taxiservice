import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { log } from 'next-axiom';
import prismaClient from '../../../lib/prismaClient';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (req.method !== 'POST')
        return res.status(405).json({ message: 'ERR_INVALID_METHOD' });
    if (!session?.user?.email)
        return res.status(401).json({ error: 'ERR_UNAUTHORIZED' });

    const email = session.user.email;
    const { subscriberID,agencyID } = <{ subscriberID: string; agencyID:string }>req.body;

    if (subscriberID === '')
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });

    const uniqueSubscriberID = agencyID + subscriberID;

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });

        const agency = await prisma.agency.findFirst({
            where: {
                id: agencyID
            }
        });

        if (!agency)
            return res.status(404).json({ error: 'ERR_AGENCY_NOT_FOUND' });

        const subscriber = await prisma.subscribers.delete({
            where: {
                subscriberID: uniqueSubscriberID
            }
        });

        if (!subscriber)
            return res.status(500).json({ error: 'ERR_SUBSCRIBER_NOT_DELETED' });

        const agencies = await prisma.agency.findMany({
            select: {
                id: true,
            },
            where: {
                userId: user.id
            }
        });

        const subscribers = await prisma.subscribers.findMany({
            where: {
                agencyId: {
                    in: agencies.map(agency => agency.id)
                }
            }
        });
        subscribers.forEach(subscriber => {
            subscriber.subscriberID = subscriber.subscriberID.substring(agencyID.length);

        });
        if (!subscriber)
            return res.status(500).json({ error: 'ERR_SUBSCRIBER_NOT_CREATED' });

        return res.status(200).json({ subscribers: subscribers });



    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;