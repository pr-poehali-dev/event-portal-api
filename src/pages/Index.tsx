
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getEvents, Event } from "@/api/eventAPI";
import EventCard from "@/components/events/EventCard";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getEvents();
        // Берем только 3 последних события для главной страницы
        setFeaturedEvents(events.slice(0, 3));
      } catch (error) {
        console.error("Ошибка загрузки мероприятий:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventUpdate = (updatedEvent: Event) => {
    setFeaturedEvents(prevEvents =>
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              АфишаГид: Все мероприятия Копейска и Челябинска
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl">
              Найдите интересные мероприятия рядом с вами, отмечайте события, 
              которые планируете посетить, делитесь с друзьями!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/events">
                  Посмотреть афишу
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">
                  Зарегистрироваться
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Популярные мероприятия
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/events" className="flex items-center">
                Все мероприятия <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onUpdate={handleEventUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Пока нет доступных мероприятий
              </p>
              <Button asChild>
                <Link to="/events">
                  Проверить афишу
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Как это работает
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Найдите мероприятие</h3>
              <p className="text-muted-foreground">
                Просматривайте афишу событий в Копейске и Челябинске, фильтруйте мероприятия по категориям и датам.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Отметьте своё участие</h3>
              <p className="text-muted-foreground">
                Зарегистрируйтесь и отмечайте мероприятия, которые планируете посетить, ставьте лайки.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Делитесь с друзьями</h3>
              <p className="text-muted-foreground">
                Поделитесь интересными мероприятиями с друзьями в социальных сетях или через мессенджеры.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
