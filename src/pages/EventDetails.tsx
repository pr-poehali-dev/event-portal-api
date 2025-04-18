
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Event, getEventById, toggleEventLike, updateEventAttendance } from "@/api/eventAPI";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Heart, Calendar, MapPin, Share2, UserCheck, UserX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const eventData = await getEventById(id, user);
        setEvent(eventData);
      } catch (error) {
        console.error("Ошибка загрузки мероприятия:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить информацию о мероприятии",
          variant: "destructive",
        });
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!isAuthenticated || !event) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы поставить лайк",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedEvent = await toggleEventLike(event.id, user!);
      setEvent(updatedEvent);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить лайк",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (status: "attending" | "notAttending" | null) => {
    if (!isAuthenticated || !event) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы отметить посещение",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedEvent = await updateEventAttendance(event.id, status, user!);
      setEvent(updatedEvent);
      
      const statusMessages = {
        attending: "Вы отметились, что пойдете на мероприятие",
        notAttending: "Вы отметились, что не пойдете на мероприятие",
        null: "Вы отменили свой статус посещения"
      };
      
      toast({
        title: "Статус обновлен",
        description: statusMessages[status],
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус посещения",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || "Мероприятие",
        text: event?.description || "",
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Поделились мероприятием",
          description: "Спасибо за распространение информации!",
        });
      })
      .catch(() => {
        // Пользователь отменил шеринг
      });
    } else {
      // Копируем ссылку в буфер обмена
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на мероприятие скопирована в буфер обмена",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к афише
            </Link>
          </Button>
          
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full mb-6" />
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-3" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Мероприятие не найдено</h2>
          <p className="mb-6">Запрашиваемое мероприятие не существует или было удалено.</p>
          <Button asChild>
            <Link to="/events">Вернуться к афише</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к афише
          </Link>
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{event.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={event.imageUrl || "/placeholder.svg"} 
                alt={event.title} 
                className="w-full object-cover h-auto max-h-[500px]" 
              />
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center bg-muted px-3 py-1.5 rounded-md text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(event.date), "d MMMM yyyy, EEEE, HH:mm", { locale: ru })}
              </div>
              
              <div className="flex items-center bg-muted px-3 py-1.5 rounded-md text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {event.city}
              </div>
              
              {event.category && (
                <div className="bg-muted px-3 py-1.5 rounded-md text-sm">
                  {event.category}
                </div>
              )}
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-3">Описание</h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
          
          <div>
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Информация о мероприятии</h3>
              
              <div className="flex items-center mb-4">
                <UserCheck className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Идут: {event.attendingCount} чел.</span>
              </div>
              
              <div className="flex items-center mb-6">
                <Heart className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Нравится: {event.likes}</span>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  variant={event.userStatus === "attending" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus(
                    event.userStatus === "attending" ? null : "attending"
                  )}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  {event.userStatus === "attending" ? "Вы идете" : "Я пойду"}
                </Button>
                
                <Button 
                  className="w-full"
                  variant={event.userStatus === "notAttending" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus(
                    event.userStatus === "notAttending" ? null : "notAttending"
                  )}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {event.userStatus === "notAttending" ? "Вы не идете" : "Я не пойду"}
                </Button>
                
                <Button 
                  className="w-full"
                  variant={event.userLiked ? "secondary" : "outline"}
                  onClick={handleLike}
                >
                  <Heart className={`mr-2 h-4 w-4 ${event.userLiked ? "fill-current" : ""}`} />
                  {event.userLiked ? "Вам нравится" : "Нравится"}
                </Button>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Поделиться
                </Button>
              </div>
            </div>
            
            {!isAuthenticated && (
              <div className="bg-muted rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Хотите отметить, что пойдёте?</h3>
                <p className="mb-4 text-muted-foreground">
                  Войдите в аккаунт, чтобы отметить посещение и ставить лайки
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <Link to="/login">Войти</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/register">Регистрация</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
