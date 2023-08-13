$version: "2"
namespace com.shockerella

structure Moment {
    @required
    momentId: String,

    @required
    title: String,

    @required
    body: String,
    
    @required
    createdAt: Timestamp,
}

list MomentList {
    member: Moment
}