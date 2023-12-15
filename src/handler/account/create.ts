import {Request, Response} from "express"
import {PrismaClient} from "@prisma/client";
import {getAddress, verifyMessage} from "ethers";
import {ErrorBadSignature} from "../../errors.js";

const prisma = new PrismaClient()

export async function create(req: Request, res: Response) {
    const {
        roninAddress, signature, nonce
    } = req.body;

    const message = `I am ${roninAddress} and I want to create an account - nonce: ${nonce}`;

    const signer = verifyMessage(message, signature);

    if (getAddress(roninAddress) !== signer) {
        res.status(401).json(Object.assign(ErrorBadSignature, {details: "The signing address is not the same as the ronin address submitted"}));
        return
    }

    const addressExists = (await prisma.user.count({
        where: {
            roninAddress
        }
    })) >= 1;

    if (addressExists) {
        res.status(409).json({error: "Address already exists"});
        return
    }

    const user = await prisma.user.create({
        data: {
            roninAddress, webhookSecret: "",
        }, select: {
            id: true
        }
    });

    res.status(200).json({
        id: user.id, message: "Account created"
    })
}
