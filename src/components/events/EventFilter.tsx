
import { useState, useEffect } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getEventCategories } from "@/api/eventAPI";

interface FilterOptions {
  city?: string;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
  searchQuery?: string;
}

interface EventFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const EventFilter = ({ onFilterChange }: EventFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getEventCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleSearch = () => {
    onFilterChange({ ...filters, searchQuery });
  };
  
  const handleFilterChange = (name: string, value: string | Date | undefined) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };
  
  const applyFilters = () => {
    onFilterChange({ ...filters, searchQuery });
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    onFilterChange({});
    setIsOpen(false);
  };
  
  return (
    <div className="mb-8 bg-card p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск мероприятий..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Фильтры
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="city">Город</Label>
                  <Select
                    value={filters.city || ""}
                    onValueChange={(value) => handleFilterChange("city", value)}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все города</SelectItem>
                      <SelectItem value="Копейск">Копейск</SelectItem>
                      <SelectItem value="Челябинск">Челябинск</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={filters.category || ""}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все категории</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>С даты</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.fromDate ? (
                            format(filters.fromDate, "PP", { locale: ru })
                          ) : (
                            <span>Выберите дату</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.fromDate}
                          onSelect={(date) => handleFilterChange("fromDate", date)}
                          initialFocus
                          locale={ru}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>До даты</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.toDate ? (
                            format(filters.toDate, "PP", { locale: ru })
                          ) : (
                            <span>Выберите дату</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={filters.toDate}
                          onSelect={(date) => handleFilterChange("toDate", date)}
                          initialFocus
                          locale={ru}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters}>
                    Сбросить
                  </Button>
                  <Button onClick={applyFilters}>
                    Применить
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleSearch}>
            Найти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventFilter;
