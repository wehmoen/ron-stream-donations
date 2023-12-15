import Joi from 'joi';
import {getAddress, isAddress} from "ethers";

export type SubscribePayload = {
    readonly address: string,
}

export const SubscribePayloadSchema = Joi.object({
    address: Joi.string().required().custom((value, helpers) => {
        value = getAddress(value.replace("ronin:", "0x"))
        if (isAddress(value)) return value;
        return helpers.error('any.invalid');
    }),
})
