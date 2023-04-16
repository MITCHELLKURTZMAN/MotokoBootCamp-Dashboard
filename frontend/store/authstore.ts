import  { GetState, SetState, StateCreator, StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthClient, AuthClientLoginOptions } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { AnonymousIdentity, Identity } from '@dfinity/agent';
import { toastError } from '../services/toastService';


// import { AccountIdentifier } from '@dfinity/nns';
// import { getAllCanisterIds } from '../services/actorService';

// II
const identityProvider: string =
'https://identity.ic0.app/#authorize';

const sessionTimeout: BigInt =
  BigInt(480) * BigInt(60) * BigInt(1_000_000_000);

const fakeProvider: boolean = process.env.II_PROVIDER_USE_FAKE == 'true';

var authClient: AuthClient;

interface AuthState {
    principal: Principal | null;
    identity: Identity | null;
    isAuthenticated: boolean;
    login: (options?: {
      identityProvider?: string | URL;
      maxTimeToLive?: bigint;
      windowOpenerFeatures?: string;
      onSuccess?: (() => void) | (() => Promise<void>);
      onError?: ((error?: string) => void) | ((error?: string) => Promise<void>);
    }) => Promise<void>;
    logout: () => Promise<void>;
    getIdentity: () => Promise<void>;
    init: () => Promise<void>;
  }
  
  


async function getAuthClient() {
  if (!authClient) {
    authClient = await AuthClient.create();
  }
  return authClient;
}
  
  


  const loginOptions: AuthClientLoginOptions = {
    identityProvider: identityProvider,
    maxTimeToLive: BigInt(7) * BigInt(24) * BigInt(3_600_000_000_000), // 1 week
    windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
    onSuccess: () => {
      console.log('Login Successful!');
    },
    onError: (error) => {
      console.error('Login Failed: ', error);
    },
  };
  

async function initAuth() {
  const client = await getAuthClient();
  if (await client.isAuthenticated()) {
    const identity = await client.getIdentity();

    if (identity) {
      const principal = identity.getPrincipal();
      // handle successful authentication
    } else {
      // handle failed authentication
      toastError('Authentication failed');
    }
  }
}

export const useAuthStore = create(
  persist(
    (set: SetState<any>, get: GetState<any>, api: StoreApi<any>): AuthState => ({
      // Initial state
      principal: null,
      identity: null,
      isAuthenticated: false,

     // Actions
login: async () => {
    const client = await getAuthClient();
    await client.login({
      identityProvider: identityProvider,
      ...loginOptions
    });

    
  },

  getIdentity: async () => {
    const client = await getAuthClient();
    const identity = await client.getIdentity();
    if (identity) {
        const principal = identity.getPrincipal();
        set({ principal: principal, identity: identity, isAuthenticated: true });
    } else {
        set({ principal: null, identity: null, isAuthenticated: false });
    }
    },
  

      logout: async () => {
        const client = await getAuthClient();
        await client.logout();
        set({ principal: null, identity: null, isAuthenticated: false });
      },

      // Initialization
      init: async () => {
        await initAuth();
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
