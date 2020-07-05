const yargs = require('yargs');
const argv = yargs
.option('connectionString', {
  describe: 'Mongo connection string',
  type: 'string',
  nargs: 1,
  demand: 'connectionString is required',
})
.option('collection', {
  describe: 'Collection to migrate',
  type: 'string',
  nargs: 1,
  demand: 'collection is required',
})
.check(argv => {
  const collections = ['users', 'admins', 'locations', 'user.tasks', 'admin.campaigns'];
  if (!collections.includes(argv.collection)) {
    throw new Error(`collection must be one of ${collections}`)
  }
  return true
})
.help('h')
.alias('h', 'help')
.example('node migrate.js --connectionString=mongodb://uname:pass@host/db --collection=collection_name')
.argv;

const job = async (collection) => {
  try {
    const helper = require('./utils/helper');
    const batch = require(`./jobs/${collection}`);
    const model = helper.getModel(collection);
    console.log('Startd Migration');
    await batch(model);
    console.log('Migration Completed Successfully');
    process.exit();
  } catch(e) {
    console.log('Migration Failed');
    throw e
  }

};

(async (connectionString, collection) => {
  try {
    const DbConnection = require('./DbConnection');
    await DbConnection.setConnection(connectionString);
    await job(collection);
  } catch(e) {
    console.log(e)
    process.exit(1);
  }
})(argv.connectionString, argv.collection);

