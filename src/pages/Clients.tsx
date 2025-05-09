import { useEffect, useState } from 'react'
import instance from '../lib/Axios'
import Layout from '../components/Layout/Layout'

interface Employee {
    id: number
    branch: number
    branch_name: string
    name: string
    phone: string
    avatar: string
    license_file: string
    created_at: string
    updated_at: string
}

const EmployeesTable = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: 'Tashkent',
        branch: '',
    })

    useEffect(() => {
        instance.get('/company/clients/')
            .then((res) => {
                const unique = new Map<number, Employee>()
                res?.data?.results?.forEach((item: Employee) => {
                    if (!unique.has(item.id)) {
                        unique.set(item.id, item)
                    }
                })
                setEmployees(Array.from(unique.values()))
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setError("Xodimlar ro'yxatini yuklashda xatolik yuz berdi.")
                setLoading(false)
            })
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        instance.post('/company/clients/', {
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            branch: formData.branch,
        }, {
            headers: {
                'Content-Type': 'application/json',  
            }
        })
        .then((res) => {
            setEmployees((prev) => [...prev, res.data])
            setIsModalOpen(false)
            setFormData({ name: '', phone: '', city: 'Tashkent', branch: '' })
        })
        .catch((err) => {
            console.error("Yaratishda xatolik:", err)
            alert("Mijozni yaratishda xatolik yuz berdi.")
        })
    }
    

    return (
        <div>
            <Layout>
                <div className="p-6 bg-white shadow rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Mijozlar ro'yxati</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            + Mijoz
                        </button>
                    </div>

                    {loading && <p>Yuklanmoqda...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700 text-left">
                                <tr>
                                    <th className="p-3">F.I.SH</th>
                                    <th className="p-3">Telefon</th>
                                    <th className="p-3">Shahar</th>
                                    <th className="p-3">Filial</th>
                                    <th className="p-3">Yaratilgan vaqti</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50">
                                        <td className="p-3 flex items-center gap-3">
                                            <img
                                                src={emp.avatar}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <span>{emp.name}</span>
                                        </td>
                                        <td className="p-3">{emp.phone}</td>
                                        <td className="p-3">{formData.city}</td>
                                        <td className="p-3">{emp.branch_name}</td>
                                        <td className="p-3">{emp.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                        {[1, 2, '...', 9, 10].map((page, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 border rounded ${page === 1 ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </Layout>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Yangi Mijoz Qo‘shish</h3>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="F.I.SH"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Telefon"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Shahar"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Filial"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full border p-2 rounded"
                            />

                            <div className="flex justify-between pt-4">
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Saqlash
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmployeesTable
