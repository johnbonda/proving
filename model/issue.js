module.exports = {
    name: "issues",
    fields: [
        {  name: 'hash',
            type: 'String',
            length: 1000,
        },
        {
            name: 'sign',
            type: 'String',
            length: 1000,
        },
        {
            name: 'publickey',
            type: 'String',
            length: 1000,
        }
    ]
}