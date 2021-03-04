export const todoSchema = {
    title: 'TODO Schema',
    description: 'describes a todo',
    version: 0,
    type: 'object',
    properties: {
        id: {
            type: 'string',
            primary: true
        },
        name: {
            type: 'string'
        },
        completed: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            default: 0
        },
        removed: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            default: 0
        }
    },
    required: ['name']
};

/**
 * For API syncing, perhaps add a `synced` property, too.
 * If TODOs are added offline, the `synced` would be `0`,
 * but changed to `1` once they're sent to the API.
 */