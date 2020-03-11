import bcrypt from 'bcrypt';

export const hash = (password, salt) => bcrypt.hashSync(password, salt, null);
export const salt = () => bcrypt.genSaltSync(8);
