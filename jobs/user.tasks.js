module.exports = async (model) => {
    const getCount = async filter => {
        return await model.countDocuments(filter);
    }
    const submittedBy = {
        userId: '$userId',
        region: 'GCC',
        persona: 'Citizen',
    }
    const filter = {
        submittedBy: { $exists: false },
    };
    const set = {
        $set: {
            submittedBy
        }
    };
    const count = await getCount(filter);
    console.log(`Job will affect ${count} record `)
    const bulk = model.collection.initializeOrderedBulkOp();
    bulk.find(
        filter
    ).update([
        set
    ]);
    await bulk.execute();
    const affectedcount = await getCount(filter);
    console.log(`Job affected ${count-affectedcount} record `);
}