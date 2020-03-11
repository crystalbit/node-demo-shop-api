import { init as modelsInit, sync as modelsSync, close as modelsClose } from './db-models';

export const init = async function () {
    await modelsInit();
    await modelsSync();
};

export const close = modelsClose;
