import { getDbIntance } from '../Database';

export const radioButtons = [
    {
        name: 'all',
        label: 'All'
    },
    {
        name: 'completed',
        label: 'Completed'
    },
    {
        name: 'removed',
        label: 'Removed'
    }
];

export const handleComplete = async ({ target: { name, checked }}) => {
    const db = await getDbIntance();

    const query = db.todos.findOne({ selector: { id: name }});
    await query.update({
        $set: {
            completed: checked ? 1 : 0
        }
    })
};

export const deleteTodo = async todo => {
    const db = await getDbIntance();

    const query = db.todos.find().where('id').eq(todo.id);
    await query.update({
        $set: {
            removed: todo.removed ? 0 : 1
        }
    })
};