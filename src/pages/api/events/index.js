import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('event-management');

  if (req.method === 'GET') {
    const events = await db.collection('events').find({}).toArray();
    res.json(events);
  } else if (req.method === 'POST') {
    const { name, date, description, availableSeats } = req.body;
    
    const newEvent = {
      name,
      date,
      description,
      availableSeats: parseInt(availableSeats, 10) 
    };

    await db.collection('events').insertOne(newEvent);
    res.status(201).json({ message: 'Event created' });
  }
}
