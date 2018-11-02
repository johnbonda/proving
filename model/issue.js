module.exports = {
    name: "issues",
    fields: [
        {  name: 'hash',
            type: 'String',
            length: 100,
        },
        {
            name: 'sign',
            type: 'String',
            length: 100,
        },
        {
            name: 'publickey',
            type: 'String',
            length: 100,
        }
    ]
}