// types/AuthContextType.ts
import { UserAuthInfo, UserInfo } from "@web3auth/base";

export interface AuthContextType {
    provider: any;
    user: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<Partial<UserInfo> | undefined>;
    enableMFA: () => Promise<void>;
    manageMFA: () => Promise<void>;
    authenticateUser: () => Promise<UserAuthInfo | undefined>; // ← update this line
    addAndSwitchChain: () => Promise<void>;
  }
  