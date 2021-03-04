import {
    createRxDatabase,
    addRxPlugin
} from 'rxdb';
import {
    todoSchema
} from './Schema';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBReplicationPlugin } from 'rxdb/plugins/replication';
import { RxDBNoValidatePlugin } from 'rxdb/plugins/no-validate';

addRxPlugin(require('pouchdb-adapter-idb'));
addRxPlugin(require('pouchdb-adapter-http')); // enable syncing over http
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBReplicationPlugin);
addRxPlugin(RxDBNoValidatePlugin);

const collections = [
    {
        name: 'todos',
        schema: todoSchema,
        sync: true
    }
];

const syncURL = 'http://' + window.location.hostname + ':10102/';
console.log('host: ' + syncURL);

let dbPromise = null;

const _create = async () => {
    console.log('DatabaseService: creating database..');
    const db = await createRxDatabase({
        name: 'todosdb',
        adapter: 'idb'
    });
    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging

    // show leadership in title
    db.waitForLeadership().then(() => {
        console.log('isLeader now');
        document.title = '♛ ' + document.title;
    });

    // create collections
    console.log('DatabaseService: create collections');
    await Promise.all(collections.map(colData => db.collection(colData)));

    // sync
    console.log('DatabaseService: sync');
    collections.filter(col => col.sync).map(col => col.name).map(colName => db[colName].sync({
        remote: syncURL + colName + '/'
    }));

    return db;
};

export const get = () => {
    if (!dbPromise)
        dbPromise = _create();
    return dbPromise;
};
