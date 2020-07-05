const { mongo } = require("mongoose");

module.exports = async (model) => {
    const getCount = async filter => {
        return await model.countDocuments(filter);
    }
    const filter = {
        region: { $exists: false },
        persona: { $exists: false }
    };
    const set = {
        $set: {
            region: 'GCC',
            persona: 'admin'
        }
    };
    const count = await getCount(filter);
    console.log(`Job will affect ${count} record `)
    const bulk = model.collection.initializeOrderedBulkOp();
    bulk.find(
        filter
    ).update(
        set
    );
    await bulk.execute();
    const affectedcount = await getCount(filter);
    console.log(`Job affected ${count-affectedcount} record `);
}