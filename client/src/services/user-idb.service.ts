import { IDB, idb } from "./idb.service";
import { UserProfile } from "store/user/reducer";
import { AuthData } from "pages/auth/signin/types";

enum UserIDBKeys {
  profile = "profile",
  auth = "auth",
}

export class UserIDB {
  constructor(public db: IDB) {}

  async saveProfile(profile: UserProfile) {
    return this.db.keyval.set(UserIDBKeys.profile, JSON.stringify(profile));
  }
  async getProfile(): Promise<UserProfile | null> {
    const profile = await this.db.keyval.get(UserIDBKeys.profile);
    if (profile) {
      return JSON.parse(profile);
    }
    return null;
  }
  async saveAuth(auth: AuthData) {
    return this.db.keyval.set(UserIDBKeys.profile, JSON.stringify(auth));
  }
  async getAuth(): Promise<AuthData | null> {
    const auth = await this.db.keyval.get(UserIDBKeys.auth);
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }
}

export const userIDB = new UserIDB(idb);
