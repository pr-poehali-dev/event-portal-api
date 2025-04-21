
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-8 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">АфишаГид</h3>
            <p className="text-muted-foreground">
              Сервис для поиска и публикации мероприятий в Копейске и Челябинске.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-foreground transition">
                  Афиша
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition">
                  Войти
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <address className="not-italic text-muted-foreground">
              <p>Челябинск, ул. Примерная, 123</p>
              <p>Email: jobes5620@gmail.com</p>
              <p>Телефон: 7(951)251-16-49</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
          © {currentYear} АфишаГид. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
