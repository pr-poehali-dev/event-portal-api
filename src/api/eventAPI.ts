
import { User } from "@/context/AuthContext";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  city: string;
  category: string;
  imageUrl: string;
  price: string;
  likes: number;
  attendingCount: number;
  userLiked?: boolean;
  userStatus?: "attending" | "notAttending" | null;
}

// Примеры мероприятий с актуальными датами и изображениями
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Фестиваль классической музыки «Белые ночи»",
    description: "Погрузитесь в атмосферу классической музыки на набережной Невы. В программе: произведения Чайковского, Рахманинова, Мусоргского в исполнении симфонического оркестра.",
    date: "2024-07-25T19:00:00",
    city: "Санкт-Петербург",
    category: "Концерт",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1470&auto=format&fit=crop",
    price: "от 1500 ₽",
    likes: 124,
    attendingCount: 87
  },
  {
    id: "2",
    title: "Выставка «Современное искусство: взгляд в будущее»",
    description: "Уникальная экспозиция работ молодых художников, представляющих новое течение в современном искусстве. Интерактивные инсталляции и мультимедийные проекты.",
    date: "2024-08-10T10:00:00",
    city: "Москва",
    category: "Выставка",
    imageUrl: "https://images.unsplash.com/photo-1594077053809-da29647a43d8?q=80&w=1374&auto=format&fit=crop",
    price: "от 800 ₽",
    likes: 89,
    attendingCount: 55
  },
  {
    id: "3",
    title: "Гастрономический фестиваль «Вкусы России»",
    description: "Фестиваль национальной кухни с участием лучших шеф-поваров страны. Дегустации, мастер-классы, кулинарные шоу и конкурсы для всей семьи.",
    date: "2024-09-15T12:00:00",
    city: "Казань",
    category: "Фестиваль",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1374&auto=format&fit=crop",
    price: "Бесплатно",
    likes: 152,
    attendingCount: 103
  },
  {
    id: "4",
    title: "Международный кинофестиваль короткометражных фильмов",
    description: "Показы лучших короткометражных фильмов из разных стран мира. Встречи с режиссерами, дискуссии и мастер-классы от профессионалов киноиндустрии.",
    date: "2024-08-25T18:30:00",
    city: "Москва",
    category: "Кино",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop",
    price: "от 600 ₽",
    likes: 75,
    attendingCount: 42
  },
  {
    id: "5",
    title: "Фестиваль электронной музыки «Digital Waves»",
    description: "Масштабное музыкальное событие с участием известных диджеев и продюсеров. Несколько сцен, световое шоу и интерактивные зоны для отдыха.",
    date: "2024-07-30T20:00:00",
    city: "Сочи",
    category: "Фестиваль",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
    price: "от 2500 ₽",
    likes: 198,
    attendingCount: 145
  },
  {
    id: "6",
    title: "Театральный фестиваль «Золотая маска»",
    description: "Показы лучших театральных постановок года. В программе: драма, комедия, опера, балет, современный танец и уникальные экспериментальные спектакли.",
    date: "2024-09-05T19:00:00",
    city: "Москва",
    category: "Театр",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1471&auto=format&fit=crop",
    price: "от 1800 ₽",
    likes: 112,
    attendingCount: 76
  }
];

// Имитация хранилища данных
let events = [...initialEvents];
const userEventInteractions: Record<string, Record<string, {
  liked: boolean;
  status: "attending" | "notAttending" | null;
}>> = {};

// Получение списка мероприятий с применением фильтров
export const getEvents = async (
  filters: {
    city?: string;
    category?: string;
    fromDate?: Date;
    toDate?: Date;
    searchQuery?: string;
  } = {},
  currentUser?: User | null
): Promise<Event[]> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredEvents = [...events];

  // Применение фильтров
  if (filters.city) {
    filteredEvents = filteredEvents.filter(event => 
      event.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters.category) {
    filteredEvents = filteredEvents.filter(event => 
      event.category.toLowerCase().includes(filters.category!.toLowerCase())
    );
  }

  if (filters.fromDate) {
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.date) >= filters.fromDate!
    );
  }

  if (filters.toDate) {
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.date) <= filters.toDate!
    );
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query)
    );
  }

  // Добавление информации о взаимодействиях пользователя
  if (currentUser) {
    return filteredEvents.map(event => ({
      ...event,
      userLiked: userEventInteractions[currentUser.id]?.[event.id]?.liked || false,
      userStatus: userEventInteractions[currentUser.id]?.[event.id]?.status || null
    }));
  }

  return filteredEvents;
};

// Получение детальной информации о мероприятии
export const getEventById = async (id: string, currentUser?: User | null): Promise<Event | null> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 300));

  const event = events.find(e => e.id === id);
  
  if (!event) return null;
  
  if (currentUser) {
    return {
      ...event,
      userLiked: userEventInteractions[currentUser.id]?.[event.id]?.liked || false,
      userStatus: userEventInteractions[currentUser.id]?.[event.id]?.status || null
    };
  }
  
  return event;
};

// Поставить/убрать лайк мероприятию
export const toggleEventLike = async (eventId: string, user: User): Promise<Event> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 300));

  // Инициализация взаимодействий пользователя, если их еще нет
  if (!userEventInteractions[user.id]) {
    userEventInteractions[user.id] = {};
  }
  
  if (!userEventInteractions[user.id][eventId]) {
    userEventInteractions[user.id][eventId] = { liked: false, status: null };
  }
  
  const currentLiked = userEventInteractions[user.id][eventId].liked;
  userEventInteractions[user.id][eventId].liked = !currentLiked;
  
  // Обновление счетчика лайков
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex] = {
      ...events[eventIndex],
      likes: events[eventIndex].likes + (currentLiked ? -1 : 1)
    };
    
    return {
      ...events[eventIndex],
      userLiked: !currentLiked,
      userStatus: userEventInteractions[user.id][eventId].status
    };
  }
  
  throw new Error("Мероприятие не найдено");
};

// Обновить статус посещения мероприятия
export const updateEventAttendance = async (
  eventId: string, 
  status: "attending" | "notAttending" | null,
  user: User
): Promise<Event> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 300));

  // Инициализация взаимодействий пользователя, если их еще нет
  if (!userEventInteractions[user.id]) {
    userEventInteractions[user.id] = {};
  }
  
  if (!userEventInteractions[user.id][eventId]) {
    userEventInteractions[user.id][eventId] = { liked: false, status: null };
  }
  
  const prevStatus = userEventInteractions[user.id][eventId].status;
  userEventInteractions[user.id][eventId].status = status;
  
  // Обновление счетчика посещений
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    // Если был "attending" и стал не "attending", уменьшаем счетчик
    if (prevStatus === "attending" && status !== "attending") {
      events[eventIndex].attendingCount -= 1;
    }
    // Если не был "attending" и стал "attending", увеличиваем счетчик
    else if (prevStatus !== "attending" && status === "attending") {
      events[eventIndex].attendingCount += 1;
    }
    
    return {
      ...events[eventIndex],
      userLiked: userEventInteractions[user.id][eventId].liked,
      userStatus: status
    };
  }
  
  throw new Error("Мероприятие не найдено");
};

// Создание нового мероприятия (для администраторов)
export const createEvent = async (eventData: Omit<Event, "id" | "likes" | "attendingCount">): Promise<Event> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 500));

  const newEvent: Event = {
    ...eventData,
    id: (events.length + 1).toString(),
    likes: 0,
    attendingCount: 0
  };
  
  events.unshift(newEvent);
  return newEvent;
};

// Обновление существующего мероприятия (для администраторов)
export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<Event> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 500));

  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex === -1) {
    throw new Error("Мероприятие не найдено");
  }
  
  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData
  };
  
  return events[eventIndex];
};

// Удаление мероприятия (для администраторов)
export const deleteEvent = async (eventId: string): Promise<void> => {
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 500));

  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex === -1) {
    throw new Error("Мероприятие не найдено");
  }
  
  events = events.filter(e => e.id !== eventId);
};
