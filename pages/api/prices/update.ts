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
    const { location, agencyID, price,id } = <{id:string, location: number[]; agencyID: string;price:number }>req.body;
    let { address } = <{ address:string }>req.body;

    const maxAddressLength = 800;
    address = address.substring(0, maxAddressLength);

    if (arrayHasNullOrEmptyItem([id,agencyID, price, location, address]))
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    if (address.length === 0 || location.length !== 2)
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

        const priceItem = await prisma.prices.update({
            where: {
                id: id
            },
            data: {
                address: address,
                latitude: location[0],
                longitude: location[1],
                price:price,
                agencyId:agencyID
            }
        });
        if (!priceItem)
            return res.status(404).json({ error: 'ERR_ITEM_NOT_FOUND' });

        const personel = await prisma.personel.findMany({
            where: {
                userId: user.id,
                isEnable: true
            },
        });

        const agencies = await prisma.agency.findMany({
            where: {
                id: {
                    in: personel.map((a) => a.agencyId)
                }
            }
        });
        const prices = await prisma.prices.findMany({
            where: {
                agencyId: {
                    in: agencies.map((a) => a.id)
                }
            }
        });

        return res.status(200).json({ prices: prices });



    }
    catch (error) {
        log.error(JSON.stringify(error));
        return res.status(500).json({ error: 'ERR_UNKNOWN' });
    }
};
export default Handler;