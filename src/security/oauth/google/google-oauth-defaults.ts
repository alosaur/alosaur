export class GoogleOauthDefaults {
  static callbackPath = "signin-google";
  static authorizationEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  static tokenEndpoint = "https://oauth2.googleapis.com/token";
  static userInformationEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";
  static scope = "profile email openid";
}
