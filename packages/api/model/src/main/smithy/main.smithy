$version: "2"
namespace com.shockerella

use aws.protocols#restJson1

/// The backend api for the journey-jigsaw website.
@restJson1
service api {
    version: "1.0"
    operations: [
      GetTokensFromAuthorizationCode
      GetCognitoClientId
      PostMoment
      GetFeed
    ]
    errors: [
      BadRequestError
      NotAuthorizedError
      InternalFailureError
    ]
}