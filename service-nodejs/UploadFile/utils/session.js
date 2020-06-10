module.exports = {
    onUpdated: (session) => ({
        updatedAt: Date.now(),
        updatedBy: {
            _id : session ? session.sub : null,
            email: session ? session.email : null,
            name: session ? session.name : null,
        },
        modifiedBy: session || null,
    }),
    onCreated : (session) => ({
        createdBy: {
            _id : session ? session.sub : null,
            email: session ? session.email : null,
            name: session ? session.name : null,
        },
        modifiedBy: session || null,
    }),
}
