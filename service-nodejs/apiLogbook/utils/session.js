module.exports = {
    onUpdated: (session) => ({
        updatedAt: Date.now(),
        updatedBy: {
            _id : session ? session.user_id : null,
            email: session ? session.email : null,
            username: session ? session.username : null,
        },
        modifiedBy: session || null,
    }),
    onCreated : (session) => ({
        createdBy: {
            _id : session ? session.user_id : null,
            email: session ? session.email : null,
            username: session ? session.username : null,
        },
        modifiedBy: session || null,
    }),

    onFileUpdated: (file) => ({
        filePath: file ? session.filePath : null,
        fileURL: file ? session.fileURL : null,
    }),
    onFileCreated: (file) => ({
        filePath: file ? file.filePath : null,
        fileURL: file ? file.fileURL : null,
    }),
}