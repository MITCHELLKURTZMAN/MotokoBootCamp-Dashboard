import { Result } from 'src/declarations/Verifier/Verifier.did';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { getVerifierActor } from '../services/actorService';



export interface AdminDataStore {
    getTotalStudents: () => Promise<string>;
    getTotalTeams: () => Promise<string>;
    getTotalProjectsCompleted: () => Promise<string>;
    adminCreateTeam: (teamName: string) => Promise<void>;
    totalTeams: string;
    totalStudents: string;
    totalProjectsCompleted: string;
}

const createAdminDataStore = (
  set: (state: Partial<AdminDataStore>) => void,
  get: () => AdminDataStore
): AdminDataStore => ({
    totalStudents: "0",
    totalTeams: "0",
    totalProjectsCompleted: "0",

    adminCreateTeam: async (teamName: string): Promise<void> => {
        const result = await (await getVerifierActor()).adminCreateTeam(teamName);
        console.log("AdminCreateTeam", result)
    },


    getTotalStudents: async (): Promise<string> => {
        const result = await (await getVerifierActor()).getTotalStudents();
        console.log("totalStudents", result)
        
            set({
                totalStudents: result,
            });
            return result;
       
    },

    getTotalTeams: async (): Promise<string> => {
        const result = await (await getVerifierActor()).getTotalTeams();
        console.log("totalTeams", result)
    

            set({
                totalTeams: result,
            });
            return result;

    },

    getTotalProjectsCompleted: async (): Promise<string> => {
        const result = await (await getVerifierActor()).getTotalProjectsCompleted();
        console.log("totalProjectsCompleted", result)
        
            set({
                totalProjectsCompleted: result,
            });
            return result;

    },

  
});

export const useAdminDataStore = create<AdminDataStore> ()(
  persist(
    (set, get) => createAdminDataStore(set, get) as any,
    {
      name: 'AdminDataStore',
      getStorage: () => sessionStorage,
    }
  )
);
