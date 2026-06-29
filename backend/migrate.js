import 'dotenv/config';
import mongoose from 'mongoose';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(' Connected');

  const result = await mongoose.connection
    .collection('products')
    .updateMany(
      { image: { $exists: false } },
      { $set: { image: null } }
    );

  console.log(` Migration done — ${result.modifiedCount} documents updated`);
  await mongoose.disconnect();
};

run().catch(console.error);
