
import { User } from "../context/AuthContext";

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  city: "Копейск" | "Челябинск";
  category: string;
  likes: number;
  attendingCount: number;
  createdBy: string;
  userStatus?: "attending" | "notAttending" | null;
  userLiked?: boolean;
}

// Моковые данные для разработки
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Концерт в Челябинской филармонии",
    description: "Симфонический оркестр исполнит классические произведения Чайковского и Бетховена",
    imageUrl: "/placeholder.svg",
    date: new Date(2023, 9, 15, 19, 0),
    city: "Челябинск",
    category: "Концерты",
    likes: 42,
    attendingCount: 18,
    createdBy: "admin"
  },
  {
    id: "2",
    title: "Выставка местных художников",
    description: "Приглашаем посетить выставку работ копейских художников. Вход свободный.",
    imageUrl: "/placeholder.svg",
    date: new Date(2023, 9, 20, 12, 0),
    city: "Копейск",
    category: "Выставки",
    likes: 28,
    attendingCount: 15,
    createdBy: "admin"
  },
  {
    id: "3",
    title: "Фестиваль уличной еды",
    description: "Попробуйте блюда от лучших шеф-поваров города на центральной площади",
    imageUrl: "/placeholder.svg",
    date: new Date(2023, 9, 25, 10, 0),
    city: "Челябинск",
    category: "Фестивали",
    likes: 85,
    attendingCount: 120,
    createdBy: "admin"
  }
];

let events = [...mockEvents];

// Для хранения состояния в памяти (для моков)
interface UserEventStatus {
  userId: string;
  eventId: string;
  status: "attending" | "notAttending" | null;
  liked: boolean;
}

let userEventStatus: UserEventStatus[] = [];

// GET: Получение списка мероприятий с фильтрацией
export const getEvents = async (filters?: {
  city?: string;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
  searchQuery?: string;
}, currentUser?: User | null) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredEvents = [...events];
  
  // Применяем фильтры
  if (filters) {
    if (filters.city) {
      filteredEvents = filteredEvents.filter(event => 
        event.city.toLowerCase() === filters.city?.toLowerCase()
      );
    }
    
    if (filters.category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    
    if (filters.fromDate) {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.date) >= new Date(filters.fromDate!)
      );
    }
    
    if (filters.toDate) {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.date) <= new Date(filters.toDate!)
      );
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query)
      );
    }
  }
  
  // Если есть пользователь, добавляем его статус для каждого события
  if (currentUser) {
    filteredEvents = filteredEvents.map(event => {
      const userStatus = userEventStatus.find(
        status => status.userId === currentUser.id && status.eventId === event.id
      );
      
      return {
        ...event,
        userStatus: userStatus?.status || null,
        userLiked: userStatus?.liked || false
      };
    });
  }
  
  return filteredEvents;
};

// GET: Получение конкретного мероприятия по ID
export const getEventById = async (id: string, currentUser?: User | null) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    throw new Error("Мероприятие не найдено");
  }
  
  if (currentUser) {
    const userStatus = userEventStatus.find(
      status => status.userId === currentUser.id && status.eventId === id
    );
    
    return {
      ...event,
      userStatus: userStatus?.status || null,
      userLiked: userStatus?.liked || false
    };
  }
  
  return event;
};

// POST: Создание нового мероприятия (только для админа)
export const createEvent = async (eventData: {
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  city: "Копейск" | "Челябинск";
  category: string;
}, currentUser: User) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!currentUser.isAdmin) {
    throw new Error("Только администраторы могут создавать мероприятия");
  }
  
  const newEvent: Event = {
    ...eventData,
    id: String(Date.now()),
    likes: 0,
    attendingCount: 0,
    createdBy: currentUser.id
  };
  
  events = [...events, newEvent];
  
  return newEvent;
};

// PUT: Обновление существующего мероприятия (только для админа)
export const updateEvent = async (
  eventId: string,
  eventData: {
    title: string;
    description: string;
    imageUrl: string;
    date: Date;
    city: "Копейск" | "Челябинск";
    category: string;
  },
  currentUser: User
) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!currentUser.isAdmin) {
    throw new Error("Только администраторы могут редактировать мероприятия");
  }
  
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    throw new Error("Мероприятие не найдено");
  }
  
  // Обновляем мероприятие, сохраняя неизменяемые поля
  const updatedEvent: Event = {
    ...events[eventIndex],
    ...eventData,
  };
  
  events[eventIndex] = updatedEvent;
  
  return updatedEvent;
};

// DELETE: Удаление мероприятия (только для админа)
export const deleteEvent = async (eventId: string, currentUser: User) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!currentUser.isAdmin) {
    throw new Error("Только администраторы могут удалять мероприятия");
  }
  
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    throw new Error("Мероприятие не найдено");
  }
  
  // Удаляем мероприятие
  events = events.filter(e => e.id !== eventId);
  
  // Удаляем все связанные статусы пользователей
  userEventStatus = userEventStatus.filter(s => s.eventId !== eventId);
  
  return { success: true };
};

// PATCH: Изменение статуса посещения мероприятия
export const updateEventAttendance = async (
  eventId: string, 
  status: "attending" | "notAttending" | null,
  currentUser: User
) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!currentUser) {
    throw new Error("Требуется авторизация");
  }
  
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    throw new Error("Мероприятие не найдено");
  }
  
  const existingStatusIndex = userEventStatus.findIndex(
    s => s.userId === currentUser.id && s.eventId === eventId
  );
  
  const oldStatus = existingStatusIndex >= 0 
    ? userEventStatus[existingStatusIndex].status 
    : null;
  
  // Обновляем счетчик посещений
  if (oldStatus === "attending" && status !== "attending") {
    event.attendingCount = Math.max(0, event.attendingCount - 1);
  } else if (oldStatus !== "attending" && status === "attending") {
    event.attendingCount += 1;
  }
  
  // Обновляем статус пользователя
  if (existingStatusIndex >= 0) {
    userEventStatus[existingStatusIndex].status = status;
  } else {
    userEventStatus.push({
      userId: currentUser.id,
      eventId,
      status,
      liked: false
    });
  }
  
  return { ...event, userStatus: status };
};

// PATCH: Лайк/дизлайк мероприятия
export const toggleEventLike = async (eventId: string, currentUser: User) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!currentUser) {
    throw new Error("Требуется авторизация");
  }
  
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    throw new Error("Мероприятие не найдено");
  }
  
  const existingStatusIndex = userEventStatus.findIndex(
    s => s.userId === currentUser.id && s.eventId === eventId
  );
  
  let isLiked;
  
  if (existingStatusIndex >= 0) {
    // Меняем состояние лайка на противоположное
    isLiked = !userEventStatus[existingStatusIndex].liked;
    userEventStatus[existingStatusIndex].liked = isLiked;
  } else {
    // Создаем новую запись с лайком
    isLiked = true;
    userEventStatus.push({
      userId: currentUser.id,
      eventId,
      status: null,
      liked: true
    });
  }
  
  // Обновляем количество лайков
  event.likes = isLiked 
    ? event.likes + 1 
    : Math.max(0, event.likes - 1);
  
  return { ...event, userLiked: isLiked };
};

// Получение категорий мероприятий
export const getEventCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Для простоты вернем статичный список категорий
  return [
    "Концерты",
    "Выставки",
    "Фестивали",
    "Спорт",
    "Образование",
    "Театр",
    "Кино",
    "Другое"
  ];
};
