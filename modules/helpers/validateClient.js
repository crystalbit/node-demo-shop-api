const phoneMask =require('./phoneMask');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * @param {object} client - client data
 * @returns {object} - validation data
 */
module.exports = function validateClient(client) {
    const invalidFields = {
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