
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, UserCircle, Plus, LogOut, Calendar } from "lucide-react";

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:opacity-90 transition">
          АфишаГид
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/events" className="hover:underline">
            Афиша
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.name || user?.email}
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/events/create" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Создать мероприятие</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Админ панель</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Войти
              </Button>
              <Button onClick={() => navigate("/register")}>
                Регистрация
              </Button>
            </div>
          )}
        </nav>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-background shadow-lg rounded-md p-4 z-50 w-52">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/events" 
                  className="px-2 py-1.5 hover:bg-accent rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Афиша
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <>
                        <Link 
                          to="/events/create" 
                          className="px-2 py-1.5 hover:bg-accent rounded-md flex items-center"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Создать мероприятие</span>
                        </Link>
                        <Link 
                          to="/dashboard" 
                          className="px-2 py-1.5 hover:bg-accent rounded-md flex items-center"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Админ панель</span>
                        </Link>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }} 
                      className="px-2 py-1.5 text-destructive hover:bg-accent rounded-md text-left flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Выйти</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="px-2 py-1.5 hover:bg-accent rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      Войти
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-2 py-1.5 hover:bg-accent rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
