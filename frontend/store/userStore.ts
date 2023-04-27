import { GetState, SetState, StateCreator, StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '../types/types';
import { getVerifierActor } from '../services/actorService';
import { VerifyProject } from 'src/declarations/Verifier/Verifier.did';
import { toastError, toast, ToastType } from '../services/toastService';
import { DailyProject } from '../../src/declarations/Verifier/Verifier.did';

export interface UserStore {
  readonly user: Student | undefined;
  readonly registered: boolean;
  readonly completedDays: DailyProject[];
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
  getStudentcompletedDays: () => Promise<void>;
  result: any; 
}

const toUserModel = (user: Student): Student => {
  return {
    ...user,
  } as Student;
};

const serialize = (state: UserStore): string => {
  const replacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    return value;
  };
  return JSON.stringify(state, replacer);
};

const deserialize = (str: string): UserStore => {
  const reviver = (key: string, value: any) => {
    if (typeof value === 'string' && value.endsWith('n')) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  };
  return JSON.parse(str, reviver);
};




const createUserStore = (
  set: SetState<UserStore>,
  get: GetState<UserStore>,
  store: StoreApi<UserStore>
): UserStore => ({
  completedDays: [],
  user: undefined,
  registered: true,
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
      toast(`${handle}, welcome to Motoko Bootcamp!`, ToastType.Success);
      set({ user: toUserModel(result.ok) });
    }
  },

  getStudentcompletedDays: async (): Promise<void> => {
    const result = await (
      await getVerifierActor()
    ).getStudentCompletedDays();
    if ('err' in result) {
      console.error("err", result.err);
    } else {
      set({ completedDays: result.ok });
      console.log("completedDays", result.ok)
    }
  },

  getUser: async (principalId): Promise<void> => {
    const result = await (await getVerifierActor()).getStudent(principalId.toString());
    if ('err' in result) {
      set({
        user: undefined,
        registered: false,
      });
    } else {
      let user = toUserModel(result.ok);
      set({
        user,
        registered: true,
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
    function getErrorMessage(errorObj: object): string | null {
      const values = Object.values(errorObj);
      if (values.length > 0) {
        return values[0] as string;
      }
      return null;
    }
  const result = await (
    await getVerifierActor()
  ).verifyProject(canisterId, BigInt(day));
  if ('err' in result) {
    const errorMessage = getErrorMessage(result.err);
    if (errorMessage) {
      toastError(errorMessage);
      console.error(errorMessage);
    } else {
      console.error("Unknown error:", result.err as any);
    }
  } else {
    set({ result: { ...result } });
    toast("Project verified!", ToastType.Success);
    console.log("Result from verifyProject:", result);
    return result;
  }

  return result;
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

