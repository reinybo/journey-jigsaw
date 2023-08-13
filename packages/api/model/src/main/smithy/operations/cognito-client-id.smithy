$version: "2"
namespace com.shockerella

@readonly
@http(method: "GET", uri: "/cognito/userpool/client-id")
operation GetCognitoClientId {
    output := {
        @required
        clientId: String,
    }
    errors: [NotFoundError]
}
