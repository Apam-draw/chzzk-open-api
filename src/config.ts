export const CHZZK_AUTHORIZATION_URL = "https://chzzk.naver.com/account-interlock";
export const CHZZK_API_BASE_URL = "https://openapi.chzzk.naver.com";

export interface ChzzkConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
