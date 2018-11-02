module.exports = {

    name: 'payslip',
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
            name: 'empid',
            type: 'String',
            length: 100,
            not_null: true,
            unique: true
        },
        {
            name: 'name',
            type: 'String',
            length: 100,
            not_null: true
        },
        {
            name: 'employer', 
            type: 'String',
            length: 100,
            not_null: true
        },
        {
            name: 'month',
            type: 'String',
            length: 100,
            not_null: true
        },
        {
            name: 'year',
            type: 'String',
            length: 100,
            not_null: true
        }
    ]
}