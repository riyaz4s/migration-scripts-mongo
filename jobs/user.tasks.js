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
    try {
        const bulk = model.collection.initializeOrderedBulkOp();
        bulk.find(
            filter
        ).update([
            set
        ]);
        await bulk.execute();
    } catch (e) {
        const affectedcount = await getCount(filter);
        if(e && e.code === 14 && count - affectedcount === 0) {
            console.log('Retrying with legacy code')
            let requests = [];
            for await (const task of model.find(filter)) {
                requests.push({
                    'updateOne': {
                        'filter': { '_id': task._id },
                        'update': {
                            $set: {
                                submittedBy: {
                                    ...submittedBy,
                                    userId: task.userId,
                                }
                            }
                        }
                    }
                });
                if (requests.length === 500) {
                    await model.collection.bulkWrite(requests);
                    requests = [];
                }
            }
            if (requests.length > 0) {
                await model.collection.bulkWrite(requests);
            }
        } else {
            throw e
        }
    }

    const affectedcount = await getCount(filter);
    console.log(`Job affected ${count - affectedcount} record `);
}