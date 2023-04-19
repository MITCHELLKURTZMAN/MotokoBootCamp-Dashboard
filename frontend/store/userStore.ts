import { GetState, SetState, StateCreator, StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '../types/types';
import { getVerifierActor, getStudent } from '../services/actorService';

export interface UserStore {
  readonly user: Student | undefined;
  readonly unregistered: boolean;

  registerUser: (
    handle: string,
    displayName: string,
    avatar: string
  ) => Promise<void>;
  getUser: (principalId: string) => Promise<void>;
  clearUser: () => Promise<void>;
  clearAll: () => void;
}

const toUserModel = (user: Student): Student => {
  return {
    ...user,
  } as Student;
};

const createUserStore = (
  set: SetState<UserStore>,
  get: GetState<UserStore>,
  store: StoreApi<UserStore>
): UserStore => ({
  user: undefined,
  unregistered: true,

  registerUser: async (
    handle: string,
   
  ): Promise<void> => {
    const result = await (
      await getVerifierActor()
    ).registerStudent(handle);
    if ('err' in result) {
      console.error(result.err);
    } else {
      set({ user: toUserModel(result.ok) });
    }
  },

  getUser: async (principalId): Promise<void> => {
    const result = await (await getVerifierActor()).getStudent(principalId);
    if ('err' in result) {
      set({
        user: undefined,
        unregistered: result.err === 'User not found',
      });
    } else {
      let user = toUserModel(result.ok);
      set({
        user,
        unregistered: false,
      });
    }
  },

  clearUser: async (): Promise<void> => {
    set({ user: undefined });
  },

  clearAll: (): void => {
    set({}, true);
  },
});

export const useUserStore = create<UserStore>()(
  persist(
    (set, get, store) => createUserStore(set, get, store) as any,
    {
      name: 'userStore',
      getStorage: () => sessionStorage,
    }
  )
);
