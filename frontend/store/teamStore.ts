import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, TeamString } from '../types/types';
import { getTeam, getAllTeams } from '../services/actorService';

export interface TeamStore {
    team: Team | undefined;
    teams: TeamString[] | undefined;
    getTeamError: string | undefined;
    getTeam: (teamId: string) => Promise<Team | undefined>;
    getAllTeams: () => Promise<TeamString[] | undefined>;
}

const createTeamStore = (
    set: (state: Partial<TeamStore>) => void,
    get: () => TeamStore
): TeamStore => ({
    team: undefined,
    teams: undefined,
    getTeamError: undefined,
    getAllTeams: async (): Promise<TeamString[] | undefined> => {
        try {
            const fetchedTeams: TeamString[] = await getAllTeams();
            set({ teams: fetchedTeams });
            console.log ("teamStore by names: " + useTeamStore.getState().teams.map((team) => team.name + ", "));
            return fetchedTeams;
        } catch (error) {
            // Handle the error and update the state with the error message
            const errorMessage = 'Error fetching all teams';
            set({ getTeamError: errorMessage });
            return undefined;
        }
    },
    getTeam: async (teamId: string): Promise<Team | undefined> => {
        try {
            const fetchedTeam: Team = await getTeam(teamId);
            set({ team: fetchedTeam });
            return fetchedTeam;
        } catch (error) {
            // Handle the error and update the state with the error message
            const errorMessage = 'Error fetching the team';
            set({ getTeamError: errorMessage });
            return undefined;
        }
    },
});


export const useTeamStore = create<TeamStore> ()(
    persist(
        (set, get) => createTeamStore(set, get) as any,
        {
            name: 'teamStore',
            getStorage: () => sessionStorage,
        }
    )
);

