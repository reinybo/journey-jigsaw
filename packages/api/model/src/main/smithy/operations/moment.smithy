$version: "2"
namespace com.shockerella

/// This operation allows a user to create a new moment, which will
/// appear in others' news feed.
///
/// # Errors
/// - `InternalFailureError`: Indicates an internal server error.
@http(method: "POST", uri: "/moment")
operation PostMoment {
    input := {
        /// The title of the moment.
        @required
        @httpQuery("title")
        title: String,
        
        /// The content or body of the moment.
        @required
        @httpQuery("body")
        body: String,
    }
    output := {
        @required
        message: String
    }
    errors: [InternalFailureError]
}
