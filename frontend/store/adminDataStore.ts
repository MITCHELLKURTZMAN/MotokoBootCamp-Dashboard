import { HelpTicket, Result, Result_1, Result_2 } from 'src/declarations/Verifier/Verifier.did';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { getVerifierActor } from '../services/actorService';
import { toastError, toast, ToastType } from '../services/toastService';



export interface AdminDataStore {
    getTotalStudents: () => Promise<string>;
    getTotalTeams: () => Promise<string>;
    getTotalProjectsCompleted: () => Promise<string>;
    adminCreateTeam: (teamName: string) => Promise<Result_2>;
    registerAdmin: (principalId: string) => Promise<Result>;
    getHelpTickets: () => Promise<HelpTicket[]>;
    resolveHelpTicket: (helpTicketId: string, resolved: boolean) => Promise<Result_1>;
    adminManuallyVerifyStudentDay:(day: string, principalId: string) => Promise<Result_1>;
    totalTeams: string;
    totalStudents: string;
    totalProjectsCompleted: string;
    helpTickets: [HelpTicket];
}

const createAdminDataStore = (
  set: (state: Partial<AdminDataStore>) => void,
  get: () => AdminDataStore
): AdminDataStore => ({
    totalStudents: "0",
    totalTeams: "0",
    totalProjectsCompleted: "0",
    helpTickets: [{day: "0", resolved: false, helpTicketId: "0", description: "0", gitHubUrl: "0", principalId: "0", canisterId: "0"}],

    adminManuallyVerifyStudentDay: async (day: string, principalId: string): Promise<Result_1> => {
        const result = await (await getVerifierActor()).adminManuallyVerifyStudentDay(day, principalId);
        console.log("adminManuallyVerifyStudentDay", result)
        if ('err' in result) {
            console.error(result.err);
            toastError(result.err);
            } else {
            toast(`Day Verified!`, ToastType.Success);
            }
            return result;
    },
    
    getHelpTickets: async (): Promise<HelpTicket[]> => {
        const result = await (await getVerifierActor()).getHelpTickets();
        console.log("getHelpTickets", result)
        if ('err' in result) {
            console.error(result.err);
            toastError(result.err);
            } 
            set({
                helpTickets: result as [HelpTicket],
            });
            return result;
    },

    resolveHelpTicket: async (helpTicketId: string, resolved: boolean): Promise<Result_1> => {
        const result = await (await getVerifierActor()).resolveHelpTicket(helpTicketId, resolved);
        console.log("reolveHelpTicket", result)
        if ('err' in result) {
            console.error(result.err);
            toastError(result.err);
            } else {
            toast(`Help Ticket Resolved!`, ToastType.Success);
            }
            return result;
    },
   
    registerAdmin: async (principalId: string): Promise<Result> => {
        const result = await (await getVerifierActor()).registerAdmin(principalId);
        console.log("registerAdmin", result)
        if ('err' in result) {
            console.error(result.err);
            toastError(result.err);
            } else {
            toast(`Help is on the way! Admin Registered.`, ToastType.Success);
            }
            return result;
    },
    adminCreateTeam: async (teamName: string): Promise<Result_2> => {
        const result = await (await getVerifierActor()).adminCreateTeam(teamName);
        console.log("adminCreateTeam", result)
        if ('err' in result) {
            console.error(result.err);
            toastError(result.err);
            } else {
            toast(`Team Created!`, ToastType.Success);
            }
            return result;
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
