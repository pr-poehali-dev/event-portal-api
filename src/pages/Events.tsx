
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/events/EventCard";
import EventFilter from "@/components/events/EventFilter";
import { getEvents, Event } from "@/api/eventAPI";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface FilterOptions {
  city?: string;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
  searchQuery?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [filters, user]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getEvents(filters, user);
      setEvents(eventsData);
    } catch (error) {
      console.error("Ошибка загрузки мероприятий:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(prevEvents =>
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Афиша мероприятий</h1>
        
        <EventFilter onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onUpdate={handleEventUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">Нет мероприятий</h3>
            <p className="text-muted-foreground">
              По вашему запросу не найдено мероприятий. Попробуйте изменить параметры фильтрации.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
