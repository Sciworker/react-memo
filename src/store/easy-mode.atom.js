// jotai
import {atomWithStorage, createJSONStorage} from 'jotai/utils';

// создаем хранилище для атома
const storage = createJSONStorage(() => localStorage)
// атом для хранения состояния упрощенного режима
export const easyModeAtom = atomWithStorage('easyMode', false, storage, {
    getOnInit: true
});


