module.exports = {
    name: "issues",
    fields: [
        {  name: 'hash',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true,
            index: true
        },
        {
            name: 'sign',
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
        }
    ]
}