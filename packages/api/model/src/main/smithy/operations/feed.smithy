$version: "2"
namespace com.shockerella

@http(method: "GET", uri: "/feed")
@readonly
@paginated(inputToken: "nextToken", outputToken: "nextToken",
           pageSize: "limit", items: "moments")
operation GetFeed {
    input: GetFeedInput,
    output: GetFeedOutput,
    errors: [InternalFailureError]
}

@input
structure GetFeedInput {
    // The number of items to fetch
    @httpQuery("limit")
    limit: Integer,

    // Pagination token or cursor to start fetching from.
    // 
    // Use the 'nextToken' which was recieved from the output of
    // the last request. Do not forget to URL-encode this JSON string.
    @httpQuery("nextToken") 
    nextToken: String,
}

@output
structure GetFeedOutput {
    // Pagination token for the next set of results (if more exist)
    // 
    // This token is a JSON-stringified version of the last moment 
    // object. This will be null if the entire database has been
    // queried.
    nextToken: String,

    @required
    moments: MomentList,
}