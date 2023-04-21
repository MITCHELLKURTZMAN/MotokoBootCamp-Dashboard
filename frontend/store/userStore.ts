import { GetState, SetState, StateCreator, StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '../types/types';
import { getVerifierActor, getStudent, verifyProject } from '../services/actorService';
import { VerifyProject } from 'src/declarations/Verifier/Verifier.did';

export interface UserStore {
  readonly user: Student | undefined;
  readonly unregistered: boolean;
  //readonly result: any;

  registerUser: (
    handle: string,
    // displayName: string,
    // avatar: string
  ) => Promise<void>;
  getUser: (principalId: string) => Promise<void>;
  clearUser: () => Promise<void>;
  clearAll: () => void;
  verifyProject: (canisterId: string, day: number) => Promise<VerifyProject>;
  result: any; 
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
  result: undefined,

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
  verifyProject: async (canisterId: string, day: number): Promise<VerifyProject> => {
    const result = await (
      await getVerifierActor()
    ).verifyProject(canisterId, BigInt(day));
    if ('err' in result) {
      console.error(result.err);
    } else {
      set({ result: { ...result } });
      console.log("Result from verifyProject:", result)
      return result;
    }
  }
  


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
