
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Event, getEvents } from "@/api/eventAPI";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Управление мероприятиями</h2>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Загрузка данных...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Город</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead className="text-right">Посетители</TableHead>
                  <TableHead className="text-right">Лайки</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow 
                      key={event.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        {format(new Date(event.date), "d MMM yyyy", { locale: ru })}
                      </TableCell>
                      <TableCell>{event.city}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell className="text-right">{event.attendingCount}</TableCell>
                      <TableCell className="text-right">{event.likes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Нет доступных мероприятий</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
