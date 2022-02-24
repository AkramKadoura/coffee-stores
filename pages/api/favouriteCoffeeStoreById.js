import { table, findRecordByFilter, getMinifiedRecords } from '../../lib/airtable';

const favouriteCoffeeStoreById = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { id } = req.body;

            if (id) {
                const records = await findRecordByFilter(id);

                if (records.length !== 0) {
                    const record = records[0];

                    const calculateLikes = parseInt(record.likes) + 1;

                    const updateRecord = await table.update([
                        {
                            "id": record.recordId,
                            "fields": {
                                "likes": calculateLikes
                            }
                        }
                    ]);

                    if (updateRecord) {
                        const minifiedRecords = getMinifiedRecords(updateRecord)
                        res.json(minifiedRecords);
                    }
                } else {
                    res.json({ message: 'Coffee store id does not exist', id });
                }
            } else {
                res.status(400);
                res.json({ message: "Id is missing" });
            }

        } catch (error) {
            res.status(500);
            res.json({ message: 'Error in liking coffee store', error });
        }
    }
};

export default favouriteCoffeeStoreById;