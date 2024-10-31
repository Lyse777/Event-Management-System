import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { LogOut, PenSquare, Trash2, FileText, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '', availableSeats: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [deleteEventId, setDeleteEventId] = useState(null);


  const today = new Date().toISOString().split('T')[0];

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage('Error loading events');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.replace('/login');
    } else {
      fetchEvents();
    }
  }, [session, status, fetchEvents, router]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage('Error loading events');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEvent) {
        await fetch(`/api/events/${editingEvent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });
        showMessage('Event updated successfully!');
      } else {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });
        showMessage('New event created successfully!');
      }
      setNewEvent({ name: '', date: '', description: '', availableSeats: '' });
      setEditingEvent(null);
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      showMessage('Error saving event');
    }
    setLoading(false);
  };

  const handleEdit = (event) => {
    setNewEvent({
      name: event.name,
      date: event.date,
      description: event.description,
      availableSeats: event.availableSeats
    });
    setEditingEvent(event);
  };

  const handleCancelEdit = () => {
    setNewEvent({ name: '', date: '', description: '', availableSeats: '' });
    setEditingEvent(null);
  };

  const handleDelete = async () => {
    if (!deleteEventId) return;
    
    setLoading(true);
    try {
      await fetch(`/api/events/${deleteEventId}`, {
        method: 'DELETE',
      });
      showMessage('Event deleted successfully!');
      setDeleteEventId(null);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      showMessage('Error deleting event');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#FF6B35] border-r-[#FF6B35] border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
       <Head>
        <title>Gobi - Dashboard</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            {editingEvent && (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8255] transition-colors"
              >
                <Plus size={20} />
                Create New Event
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg transition-opacity">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                placeholder="Event Title"
                value={newEvent.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-black"
                required
              />
              <input
                name="date"
                type="date"
                value={newEvent.date}
                onChange={handleInputChange}
                min={today}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-black"
                required
              />
              <input
                name="availableSeats"
                type="number"
                placeholder="Available Seats"
                value={newEvent.availableSeats}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-black"
                required
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-black md:col-span-2"
                rows="3"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8255] transition-colors"
            >
              {editingEvent ? <PenSquare size={20} /> : <Plus size={20} />}
              {editingEvent ? 'Update Event' : 'Add Event'}
            </button>
          </form>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Get started by creating a new event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
                <h3 className="text-xl font-semibold mb-2 text-black">{event.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">{event.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                    <span>Seats: {event.availableSeats}</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <PenSquare size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteEventId(event._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminPage;
