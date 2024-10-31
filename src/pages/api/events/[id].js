import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('event-management');
  const { id } = req.query;

  if (req.method === 'GET') {
    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    res.json(event);
  } else if (req.method === 'PUT') {
    const { name, date, description, availableSeats } = req.body;
    
    const updatedEvent = {
      name,
      date,
      description,
      availableSeats: parseInt(availableSeats, 10) 
    };

    await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );
    res.status(200).json({ message: 'Event updated' });
  } else if (req.method === 'DELETE') {
    await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Event deleted' });
  }
}
