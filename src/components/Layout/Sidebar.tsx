
import { Home, Users, Building2, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col justify-between">
            <div>
                <nav className="flex flex-col gap-4">
                    <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-orange-600">
                        <Users size={20} /> Profile
                    </Link>

                    <Link to="/hodimlar" className="flex items-center gap-2 text-gray-700 hover:text-orange-600">
                        <Users size={20} /> Xodimlar ro'yxati
                    </Link>
                    <Link to="/clients" className="flex items-center gap-2 text-gray-700 hover:text-orange-600">
                        <Home size={20} /> Mijozlar
                    </Link>
                    <Link to="#" className="flex items-center gap-2 text-gray-700 hover:text-orange-600">
                        <Building2 size={20} /> Bo‘limlar
                    </Link>
                    <Link to="/smena" className="flex items-center gap-2 text-gray-700 hover:text-orange-600">
                        <CalendarDays size={20} /> Smenalar
                    </Link>
                </nav>
            </div>

        </aside>
    );
};

export default Sidebar;
