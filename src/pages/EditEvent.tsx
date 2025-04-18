
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { getEventById, updateEvent, getEventCategories } from "@/api/eventAPI";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(5, "Заголовок должен содержать минимум 5 символов"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  imageUrl: z.string().url("Введите корректный URL изображения").or(z.string().length(0)),
  date: z.date({
    required_error: "Выберите дату мероприятия",
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Введите время в формате ЧЧ:ММ",
  }),
  city: z.enum(["Копейск", "Челябинск"], {
    required_error: "Выберите город",
  }),
  category: z.string({
    required_error: "Выберите категорию",
  }),
});

type EventFormValues = z.infer<typeof eventSchema>;

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      date: new Date(),
      time: "19:00",
      city: "Челябинск",
      category: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [event, categoryList] = await Promise.all([
          getEventById(id!, user),
          getEventCategories()
        ]);
        
        // Форматируем дату и время для формы
        const eventDate = new Date(event.date);
        const hours = eventDate.getHours().toString().padStart(2, "0");
        const minutes = eventDate.getMinutes().toString().padStart(2, "0");
        const timeStr = `${hours}:${minutes}`;
        
        form.reset({
          title: event.title,
          description: event.description,
          imageUrl: event.imageUrl === "/placeholder.svg" ? "" : event.imageUrl,
          date: eventDate,
          time: timeStr,
          city: event.city,
          category: event.category,
        });
        
        setCategories(categoryList);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные мероприятия",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, navigate, id, form]);

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Комбинируем дату и время
      const [hours, minutes] = data.time.split(':').map(Number);
      const eventDate = new Date(data.date);
      eventDate.setHours(hours, minutes);
      
      // Если imageUrl пустой, используем placeholder
      const imageUrl = data.imageUrl || "/placeholder.svg";
      
      const eventData = {
        title: data.title,
        description: data.description,
        imageUrl,
        date: eventDate,
        city: data.city,
        category: data.category,
      };
      
      await updateEvent(id!, eventData, user!);
      
      toast({
        title: "Мероприятие обновлено",
        description: "Мероприятие успешно обновлено",
      });
      
      navigate(`/events/${id}`);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить мероприятие",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button variant="outline" className="mb-6" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к панели управления
          </Button>
          
          <h1 className="text-3xl font-bold mb-8">Редактирование мероприятия</h1>
          
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Загрузка данных...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="outline" className="mb-6" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к панели управления
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Редактирование мероприятия</h1>
        
        <div className="bg-card border rounded-lg p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название мероприятия</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Подробное описание мероприятия" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL изображения (необязательно)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Дата</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ru })
                              ) : (
                                <span>Выберите дату</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Время</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Город</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Копейск">Копейск</SelectItem>
                          <SelectItem value="Челябинск">Челябинск</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default EditEvent;
