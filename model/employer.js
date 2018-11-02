module.exports = {
    name: "employer",
    fields: [
        {
            name: 'name',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true
        },
        {
            name: 'publickey',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true,
            index: true
        },
    ]
}