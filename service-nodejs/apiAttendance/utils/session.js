module.exports = {
    onUpdated: (session) => ({
        updatedAt: Date.now(),
        updatedBy: {
            _id : session ? session.user_id : null,
            email: session ? session.email : null,
            username: session ? session.username : null,
            divisi: session ? session.divisi : null,
            jabatan: session ? session.jabatan : null,
        },
        modifiedBy: session || null,
    }),
    onCreated : (session) => ({
        createdBy: {
            _id : session ? session.user_id : null,
            email: session ? session.email : null,
            username: session ? session.username : null,
            divisi: session ? session.divisi : null,
            jabatan: session ? session.jabatan : null,
        },
        modifiedBy: session || null,
    }),
}
