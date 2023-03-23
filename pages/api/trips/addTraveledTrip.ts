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

    const email = session.user.email;
    const { originLocation, destinationLocation, agencyID,price } = <{ agencyID: string, originLocation: number[]; destinationLocation: number[];price:number }>req.body;
    let { originAddress, destinationAddress, additionalInfo, subscriberID } = <{ originAddress: string; destinationAddress: string; additionalInfo: string, subscriberID: string; }>req.body;

    if (originLocation.length !== 2 || destinationLocation.length !== 2)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    if (arrayHasNullOrEmptyItem([agencyID, originAddress, destinationAddress,price]))
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });

    const maxOriginLength = 300;
    const maxDestinationLength = 300;
    const maxAdditionalInfoLength = 300;
    const maxSubscriberIDLength = 30;

    originAddress = originAddress.substring(0, maxOriginLength);
    destinationAddress = destinationAddress.substring(0, maxDestinationLength);
    additionalInfo = additionalInfo.substring(0, maxAdditionalInfoLength);
    subscriberID = subscriberID.substring(0, maxSubscriberIDLength);


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
        const trip = await prisma.trips.create({
            data: {
                agencyId: agencyID,
                originAddress: originAddress,
                destinationAddress: destinationAddress,
                description: additionalInfo,
                subscriberID: subscriberID,
                originLatitude: originLocation[0],
                originLongitude: originLocation[1],
                destinationLatitude: destinationLocation[0],
                destinationLongitude: destinationLocation[1],
                userId: user.id,
                price: price,
                status: 1,
                commission: 0,
                startDateTime: new Date(),
                endDateTime: new Date(),
            },
        });
        if (!trip)
            return res.status(500).json({ error: 'ERR_UNKNOWN' });

        return res.status(200).end();


    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;