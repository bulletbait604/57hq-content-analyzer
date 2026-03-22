// Simplified Kick OAuth wrapper using official Kick Developer API
import { KickDeveloperAPI, KickUser, KickAuthResponse } from './kick-api'

export type { KickUser, KickAuthResponse }

export class KickOAuth {
  private kickAPI: KickDeveloperAPI

  constructor(clientId: string, clientSecret: string) {
    this.kickAPI = new KickDeveloperAPI(clientId, clientSecret)
  }

  async getAuthURL(redirectURI: string): Promise<string> {
    return await this.kickAPI.getAuthURL(redirectURI)
  }

  async exchangeCodeForToken(code: string, redirectURI: string): Promise<KickAuthResponse> {
    return await this.kickAPI.exchangeCodeForToken(code, redirectURI)
  }

  async getUserInfo(accessToken: string): Promise<KickUser> {
    return await this.kickAPI.getCurrentUser(accessToken)
  }
}
