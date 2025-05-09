import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [phone_number, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const response = await axios.post('https://api.noventer.uz/api/v1/accounts/login/', {
                phone_number,
                password,
            });
        
            const tokens = response.data.data.tokens
            localStorage.setItem('accessToken', tokens.access);
            localStorage.setItem('refreshToken', tokens.refresh);
      
        
            navigate('/profile');
        } catch (err) {
            console.error(err);
            setError("Telefon raqami yoki parol noto'g'ri!");
        }
        
    }

    return (
        <div className="flex h-screen">
          
            <div className="w-1/2 hidden md:block">
                <img
                    src="/loginimg.png"
                    alt="CRM"
                    className="h-full w-full "
                />
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-sm p-6">
                    <div className="flex flex-col items-center mb-6">
                        <img src="/logo/Union.png" alt="Logo" className="h-12 mb-2" />
                        <h1 className="text-2xl font-semibold">NovEnter</h1>
                        <p className="text-sm text-gray-500 text-center mt-1">
                            Crm tizim bilan biznesingizni rivojlantiring
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {error && <p className="text-red-500 mb-3">{error}</p>}
                        <input
                            type="text"
                            placeholder="Telefon raqamingizni kiriting"
                            value={phone_number}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Parolingizni kiriting"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Tizimga kirish
                        </button>
                    </form>

                    <p className="text-center text-sm mt-4">
                         <Link to="/register" className="text-blue-600 hover:underline">Ro&apos;yxatdan o&apos;tish</Link>
                            
                       
                    </p>
                </div>
            </div>
        </div>

    )
}

export default Login
