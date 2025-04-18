
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { Event, toggleEventLike, updateEventAttendance } from "@/api/eventAPI";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Share2, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface EventCardProps {
  event: Event;
  onUpdate: (updatedEvent: Event) => void;
}

const EventCard = ({ event, onUpdate }: EventCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы поставить лайк",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLiking(true);
      const updatedEvent = await toggleEventLike(event.id, user!);
      onUpdate(updatedEvent);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить лайк",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleUpdateStatus = async (status: "attending" | "notAttending" | null) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы отметить посещение",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingStatus(true);
      const updatedEvent = await updateEventAttendance(event.id, status, user!);
      onUpdate(updatedEvent);
      
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
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + `/events/${event.id}`,
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
      navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на мероприятие скопирована в буфер обмена",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-2 hover:text-primary transition">
              <Link to={`/events/${event.id}`}>
                {event.title}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(event.date), "d MMMM yyyy, HH:mm", { locale: ru })}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="aspect-[16/9] mb-3 overflow-hidden rounded-md">
          <Link to={`/events/${event.id}`}>
            <img 
              src={event.imageUrl || "/placeholder.svg"} 
              alt={event.title} 
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center mt-2 text-xs">
          <span className="px-2 py-1 bg-muted rounded-md">{event.city}</span>
          {event.category && (
            <span className="ml-2 px-2 py-1 bg-muted rounded-md">{event.category}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex space-x-2">
          <Button
            variant={event.userLiked ? "secondary" : "ghost"}
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center ${event.userLiked ? "text-primary" : "text-muted-foreground"}`}
          >
            <Heart className={`h-4 w-4 mr-1 ${event.userLiked ? "fill-primary" : ""}`} />
            <span>{event.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-muted-foreground"
          >
            <Share2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant={event.userStatus === "attending" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleUpdateStatus(
              event.userStatus === "attending" ? null : "attending"
            )}
            disabled={isUpdatingStatus}
            className={event.userStatus === "attending" ? "text-primary" : "text-muted-foreground"}
          >
            <UserCheck className={`h-4 w-4 mr-1 ${event.userStatus === "attending" ? "text-primary" : ""}`} />
            <span>{event.attendingCount}</span>
          </Button>
          
          <Button
            variant={event.userStatus === "notAttending" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleUpdateStatus(
              event.userStatus === "notAttending" ? null : "notAttending"
            )}
            disabled={isUpdatingStatus}
            className={event.userStatus === "notAttending" ? "text-muted-foreground" : "text-muted-foreground"}
          >
            <UserX className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
