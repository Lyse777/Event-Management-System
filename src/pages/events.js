import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { Calendar, Users, FileText, ChevronRight, LogIn, CheckCircle, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    isSuccess: true
  });
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setDialogContent({
        title: 'Error',
        message: 'Failed to load events. Please refresh the page.',
        isSuccess: false
      });
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeat = async (eventId) => {
    if (bookingInProgress) return;

    try {
      setBookingInProgress(true);
      const response = await fetch(`/api/events/${eventId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();

      if (data.success) {
        await fetchEvents();
        setDialogContent({
          title: 'Booking Successful',
          message: 'Your seat has been successfully booked for this event.',
          isSuccess: true
        });
      } else {
        setDialogContent({
          title: 'Booking Failed',
          message: data.message || 'Unable to book seat. Please try again.',
          isSuccess: false
        });
      }
    } catch (error) {
      console.error('Error booking seat:', error);
      setDialogContent({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        isSuccess: false
      });
    } finally {
      setShowDialog(true);
      setBookingInProgress(false);
    }
  };

  const navigateToAdmin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#FF6B35] border-r-[#FF6B35] border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Head>
        <title>Gobi - Home</title>
      </Head>
      {}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="relative w-[200px] h-[100px]">
                <Image
                  src="/Gobi.JPG"
                  alt="Gobi Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={navigateToAdmin}
                className="px-4 py-2 bg-white border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors flex items-center gap-2"
                aria-label="Admin Login"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-black">Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-500">Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>{event.description}</p>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>
                        {event.availableSeats === 0 ? (
                          <span className="text-red-500">No seats available</span>
                        ) : (
                          `${event.availableSeats} seats available`
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSeat(event._id)}
                    disabled={event.availableSeats <= 0 || bookingInProgress}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        event.availableSeats > 0 && !bookingInProgress
                          ? 'bg-[#FF6B35] text-white hover:bg-[#E85F2D]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {bookingInProgress ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : event.availableSeats > 0 ? (
                      <>
                        Book Seat
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      'Fully Booked'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {dialogContent.isSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {dialogContent.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className={`${
                dialogContent.isSuccess ? 'bg-green-500' : 'bg-red-500'
              } text-white hover:${
                dialogContent.isSuccess ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
