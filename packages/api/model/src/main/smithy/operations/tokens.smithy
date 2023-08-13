$version: "2"
namespace com.shockerella

@readonly
@http(method: "GET", uri: "/tokens")
operation GetTokensFromAuthorizationCode {
    input := {
        @httpQuery("code")
        @required
        code: String,
    }
    output := {
        @required
        accessToken: String,

        /// A JWT `idToken` from a Cognito OAuth flow with Google as the IDP. 
        /// example payload (after decoding): https://pastebin.com/gy0aDVPV
        @required
        idToken: String,

        @required
        refreshToken: String,

        @required
        expiresAt: Timestamp,
    }
    errors: [NotFoundError, InternalFailureError]
}
