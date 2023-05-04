import { DailyTotalMetrics, HelpTicket, Result, Result_1, Result_2 } from 'src/declarations/Verifier/Verifier.did';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { getVerifierActor } from '../services/actorService';
import { toastError, toast, ToastType, toastPromise } from '../services/toastService';



export interface AdminDataStore {
    getTotalStudents: () => Promise<string>;
    getTotalTeams: () => Promise<string>;
    getTotalProjectsCompleted: () => Promise<string>;
    adminCreateTeam: (teamName: string) => Promise<Result_2>;
    registerAdmin: (principalId: string) => Promise<Result>;
    getHelpTickets: () => Promise<HelpTicket[]>;
    resolveHelpTicket: (helpTicketId: string, resolved: boolean) => Promise<Result_1>;
    adminManuallyVerifyStudentDay:(day: string, principalId: string) => Promise<Result_1>;
    getTotalCompletedPerDay: () => Promise<DailyTotalMetrics>;
    totalTeams: string;
    totalStudents: string;
    totalProjectsCompleted: string;
    helpTickets: [HelpTicket];
    totalCompletedPerDay: DailyTotalMetrics;
}

const createAdminDataStore = (
  set: (state: Partial<AdminDataStore>) => void,
  get: () => AdminDataStore
): AdminDataStore => ({
    totalStudents: "0",
    totalTeams: "0",
    totalProjectsCompleted: "0",
    helpTickets: [{day: "0", resolved: false, helpTicketId: "0", description: "0", gitHubUrl: "0", principalId: "0", canisterId: "0"}],
    totalCompletedPerDay: {day1: "0", day2: "0", day3: "0", day4: "0", day5: "0"},

    getTotalCompletedPerDay: async (): Promise<DailyTotalMetrics> => {
        const result = await (await getVerifierActor()).getTotalCompletedPerDay();
        console.log("getTotalCompletedPerDay", result)
        if ('err' in result) {
            console.error(result.err);
            } else {
                set({ totalCompletedPerDay: result });
            }
            return result;
    },


    adminManuallyVerifyStudentDay: async (day: string, principalId: string): Promise<Result_1> => {
        const resultPromise = (await getVerifierActor()).adminManuallyVerifyStudentDay(day, principalId);
        await toastPromise(resultPromise, {
          loading: 'Verifying day...',
          success: 'Day Verified!',
          error: 'Error verifying day.',
        }, ToastType.Success);
        const result = await resultPromise;
        console.log("adminManuallyVerifyStudentDay", result);
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
        const resultPromise = (await getVerifierActor()).resolveHelpTicket(helpTicketId, resolved);
        await toastPromise(resultPromise, {
          loading: 'Resolving Help Ticket...',
          success: 'Help Ticket Resolved!',
          error: 'Error resolving Help Ticket.',
        }, ToastType.Success);
        const result = await resultPromise;
        console.log("resolveHelpTicket", result);
        return result;
      },
   
      registerAdmin: async (principalId: string): Promise<Result> => {
        const resultPromise = (await getVerifierActor()).registerAdmin(principalId);
        await toastPromise(resultPromise, {
          loading: 'Registering admin...',
          success: 'Help is on the way! Admin Registered.',
          error: 'Error registering admin.',
        }, ToastType.Success);
        const result = await resultPromise;
        console.log("registerAdmin", result);
        return result;
      },
      adminCreateTeam: async (teamName: string): Promise<Result_2> => {
        const resultPromise = (await getVerifierActor()).adminCreateTeam(teamName);
        await toastPromise(resultPromise, {
          loading: 'Creating team...',
          success: 'Team Created!',
          error: 'Error creating team.',
        }, ToastType.Success);
        const result = await resultPromise;
        console.log("adminCreateTeam", result);
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
