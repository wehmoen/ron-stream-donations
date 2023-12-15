import {Request, Response} from "express"
import {PrismaClient} from "@prisma/client";
import {getAddress, verifyMessage} from "ethers";
import {ErrorBadSignature} from "../../errors.js";

const prisma = new PrismaClient()

export async function get(req: Request, res: Response) {
    const {
        roninAddress, signature, nonce
    } = req.body;

    const message = `I am ${roninAddress} and I want to retrieve my account - nonce: ${nonce}`;

    const signer = verifyMessage(message, signature);

    if (getAddress(roninAddress) !== signer) {
        res.status(401).json(Object.assign(ErrorBadSignature, {details: "The signing address is not the same as the ronin address submitted"}));
        return
    }

    const user = await prisma.user.findFirst({
        where: {
            roninAddress
        }
    })

    if (!user) {
        res.status(404).json({error: "Account not found"});
        return
    }

    res.status(200).json({
        id: user.id,
    })
}
