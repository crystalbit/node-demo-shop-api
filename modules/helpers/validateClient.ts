import phoneMask from './phoneMask';

const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IValidation {
    name: string|false
    address: string|false
    email: string|false
    phone: string|false
}

/**
 * @param {object} client - client data
 * @returns {object} - validation data
 */
export default function validateClient(client) {
    const invalidFields: IValidation = {
        name: false,
        address: false,
        email: false,
        phone: false
    }

    if (!client.name || client.name.length < 3) {
        invalidFields.name = 'Name shall be 3 symbols or more';
    }

    if (!client.address || client.address.length < 10) {
        invalidFields.address = 'Address shall be 10 symbols or more';
    }
    
    if (!client.email || !emailRegexp.test(client.email)) {
        invalidFields.email = 'Please, provide a valid email';
    }

    if (!client.phone || client.phone.length !== phoneMask.length) {
        invalidFields.phone = 'Phone validation error';
    } else {
        for (let i of Object.keys(phoneMask)) {
            if (
                (typeof phoneMask[i] === 'string' && client.phone[i] !== phoneMask[i])
                ||
                (typeof phoneMask[i] !== 'string' && !phoneMask[i].test(client.phone[i]))
            ) invalidFields.phone = 'Please, provide a valid phone';
        }
    }

    return invalidFields;
}