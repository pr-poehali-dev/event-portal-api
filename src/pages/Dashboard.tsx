
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Event, getEvents, deleteEvent } from "@/api/eventAPI";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Search, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchEvents();
  }, [user, isAdmin, navigate]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getEvents({}, user);
      setEvents(eventsData);
    } catch (error) {
      console.error("Ошибка загрузки мероприятий:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список мероприятий",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteEvent(eventToDelete.id, user!);
      
      toast({
        title: "Мероприятие удалено",
        description: "Мероприятие было успешно удалено",
      });
      
      // Обновляем список мероприятий
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить мероприятие",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const filteredEvents = searchTerm 
    ? events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : events;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <Button onClick={() => navigate("/events/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Создать мероприятие
          </Button>
        </div>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск мероприятий..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Найти</Button>
          </form>
        </div>

        <div className="bg-card border rounded-lg p-6 mb-8 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Управление мероприятиями</h2>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Загрузка данных...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead className="text-right">Посетители</TableHead>
                    <TableHead className="text-right">Лайки</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto" 
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            {event.title}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            {format(new Date(event.date), "d MMM yyyy, HH:mm", { locale: ru })}
                          </div>
                        </TableCell>
                        <TableCell>{event.city}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell className="text-right">{event.attendingCount}</TableCell>
                        <TableCell className="text-right">{event.likes}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Открыть меню</span>
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                >
                                  <path
                                    d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/events/edit/${event.id}`)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setEventToDelete(event)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">Нет доступных мероприятий</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить мероприятие "{eventToDelete?.title}"?
              <br />
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
