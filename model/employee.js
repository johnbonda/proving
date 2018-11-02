module.exports = {

    name: 'employee',
    fields: [
        {
            name: 'email',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true,
            index: true
        },
        {
            name: 'empID',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true,
        },
        {
            name: 'walletAddr',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true,
        },
        {
            name: 'salary',
            type: 'String',
            length: 100,
            not_null: true,
        },
    ]
}