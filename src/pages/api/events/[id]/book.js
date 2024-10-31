import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db('event-management');


  const event = await db.collection('events').findOne({ _id: new ObjectId(id) });

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.availableSeats <= 0) {
    return res.status(400).json({ message: 'No seats available' });
  }


  await db.collection('events').updateOne(
    { _id: new ObjectId(id) },
    { $inc: { availableSeats: -1 } }
  );

  res.status(200).json({ success: true, message: 'Seat booked successfully' });
}
