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

    let { agencyName } = <{ agencyName: string; }>req.body;
    const { isEnable } = <{ isEnable: boolean; }>req.body;
    let { phoneNumber1, phoneNumber2, mobileNumber } = <{ phoneNumber1: string, phoneNumber2: string, mobileNumber: string; }>req.body;
    let { address, currencySymbol } = <{ address: string; currencySymbol: string, }>req.body;
    const { latitude, longitude } = <{ latitude: number; longitude: number; }>req.body;
    const { commissionRate } = <{ commissionRate: number; }>req.body;
    const { workingDays, startOfWorkingHours, endOfWorkingHours } = <{ workingDays: number, startOfWorkingHours: Date, endOfWorkingHours: Date; }>req.body;

    //phoneNumber 2 is optional
    const isValid = !arrayHasNullOrEmptyItem([agencyName, isEnable, phoneNumber1, mobileNumber, address, latitude, longitude, workingDays, startOfWorkingHours, endOfWorkingHours, currencySymbol, commissionRate]);
    if (!isValid)
        return res.status(400).json({ error: 'ERR_INVALID_REQUEST' });
    const email = session.user.email;
    const maxAgencyLength = 50;
    const maxPhoneNumberLength = 30;
    const maxAddressLength = 300;
    const maxCurrencyLength = 20;

    phoneNumber2 = phoneNumber2 ? phoneNumber2 : '';
    agencyName = agencyName.trim().substring(0, maxAgencyLength);
    phoneNumber1 = phoneNumber1.trim().substring(0, maxPhoneNumberLength);
    phoneNumber2 = phoneNumber2.trim().substring(0, maxPhoneNumberLength);
    mobileNumber = mobileNumber.trim().substring(0, maxPhoneNumberLength);
    currencySymbol = currencySymbol.trim().substring(0, maxCurrencyLength);
    address = address.trim().substring(0, maxAddressLength);

    try {
        const prisma = prismaClient;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user)
            return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' });

        const agency = await prisma.agency.update({
            where: {
                agencyName: agencyName
            },
            data: {
                isEnable: isEnable,
                phoneNumber1: phoneNumber1,
                phoneNumber2: phoneNumber2,
                mobileNumber: mobileNumber,
                address: address,
                latitude: latitude,
                longitude: longitude,
                workingDays: workingDays,
                startOfWorkingHours: startOfWorkingHours,
                endOfWorkingHours: endOfWorkingHours,
                currencySymbol: currencySymbol,
                commissionRate: commissionRate,
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
