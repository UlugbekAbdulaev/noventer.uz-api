import { useEffect, useState } from 'react'
import instance from '../lib/Axios'
import Layout from '../components/Layout/Layout'
import { SquarePen, Trash2 } from 'lucide-react'
import { IBranch } from './EmployeesTable'

interface Employee {
    id: number
    name: string
    branch: number
    branch_name: string
    start_time: string
    end_time: string
    created_at: string
    updated_at: string
}


const EmployeesTable = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editData, setEditData] = useState<Employee | null>(null)
    const [selectedBranchId, setSelectedBranchId] = useState(1)

    const [formData, setFormData] = useState({
        name: '',
        branch: '',
        start_time: '',
        end_time: ''
    })
    const [branchess, setBranchess] = useState<IBranch[]>([])

    const branch_list = () => {
        instance.get('/company/get/')
          .then((res) => {
            const br = new Map<number, IBranch>()
            res?.data?.branches?.map((item: any) => {
              if (!br.has(item.id)) {
                br.set(item.id, item)
              }
            })
            setBranchess(Array.from(br.values()))
            setLoading(false)
            console.log(branchess);
            
    
    
          })
          .catch((err) => {
            console.error(err)
            setError("Xodimlar ro'yxatini yuklashda xatolik yuz berdi.")
            setLoading(false)
          })
      }
    

    const fetchShifts = (branchId = selectedBranchId) => {
        setLoading(true)
        instance.get(`/company/shifts/${branchId}/`)
            .then((res) => {
                setEmployees(res.data)
                setLoading(false)
                console.log(res);

            })
            .catch((err) => {
                console.error(err)
                setError("Smenalarni yuklashda xatolik yuz berdi.")
                setLoading(false)
            })
    }


    useEffect(() => {
        fetchShifts(),
        branch_list()
    }, [selectedBranchId])

    const handleDelete = (id: number) => {
        if (confirm("Smenani o'chirishni istaysizmi?")) {
            instance.delete(`/company/shift-detail/${id}/`)
                .then(() => {
                    setEmployees(prev => prev.filter(emp => emp.id !== id))
                })
                .catch(err => {
                    console.error("O'chirishda xatolik:", err)
                    alert("O'chirishda xatolik yuz berdi")
                })
        }
    }
    
   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {
            await instance.post('/company/shift-create/', {
                name: formData.name,
                branch: parseInt(formData.branch),
                start_time: formData.start_time,
                end_time: formData.end_time

            })

            setIsModalOpen(false)
            setFormData({ name: '', branch: '', start_time: '', end_time: '' })
            fetchShifts()
        } catch (err) {
            console.error("Smena yaratishda xatolik:", err)
            alert("Smena yaratishda xatolik yuz berdi")
        }
    }

    const handleEditClick = (employee: Employee) => {
        setEditData(employee)
        setEditModalOpen(true)
    }

    return (
        <div>
            <Layout>
                <div className="p-6 bg-white shadow rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="branchSelect" className="font-medium">Filial:</label>
                            <select
                                id="branchSelect"
                                value={selectedBranchId}
                                onChange={(e) => {
                                    const newBranchId = parseInt(e.target.value)
                                    setSelectedBranchId(newBranchId)
                                    fetchShifts(newBranchId)
                                }}
                                className="border border-gray-300 px-3 py-1 rounded"
                            >
                                {branchess.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            + Smena
                        </button>
                    </div>

                    {loading && <p>Yuklanmoqda...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700 text-left">
                                <tr>
                                    <th className="p-3">#</th>
                                    <th className="p-3">Smena</th>
                                    <th className="p-3">Boshlanish vaqti</th>
                                    <th className="p-3">Tugash vaqti</th>
                                    <th className="p-3">Tahrirlash</th>
                                    <th className="p-3">O'chirish</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {employees.map((emp, ind) => (
                                    <tr key={emp.id} className="hover:bg-gray-50">
                                        <td className="p-3">{ind + 1}</td>
                                        <td className="p-3">{emp.name}</td>
                                        <td className="p-3">{emp.start_time}</td>
                                        <td className="p-3">{emp.end_time}</td>
                                        <td className="p-3">
                                            <button onClick={() => handleEditClick(emp)}>
                                                <SquarePen className="text-blue-500 hover:text-blue-700" />
                                            </button>
                                        </td>
                                        <td className="p-3">
                                            <button onClick={() => handleDelete(emp.id)}>
                                                <Trash2 className="text-red-500 hover:text-red-700" />
                                            </button>
                                        </td>
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

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
                            <h2 className="text-lg font-semibold">Yangi Smena Qo'shish</h2>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Smena nomi"
                                className="w-full border p-2 rounded"
                            />


                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Filial tanlang</option>
                                {branchess.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>

                            <input
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                placeholder="Boshlanish vaqti (HH:MM)"
                                className="w-full border p-2 rounded"
                            />
                            <input
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                placeholder="Tugash vaqti (HH:MM)"
                                className="w-full border p-2 rounded"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Bekor
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Modal */}
                {editModalOpen && editData && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
                            <h2 className="text-lg font-semibold">Smenani Tahrirlash</h2>
                            <input
                                name="name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full border p-2 rounded"
                                placeholder="Smena nomi"
                            />
                            {/* <input
                                name="branch"
                                value={editData.branch}
                                onChange={(e) => setEditData({ ...editData, branch: parseInt(e.target.value) })}
                                className="w-full border p-2 rounded"
                                placeholder="Filial ID"
                            /> */}<select
                                id="branchSelect"
                                value={selectedBranchId}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full border p-2 rounded"
                            >
                                {branchess.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                            <input

                                name="start_time"
                                value={editData.start_time}
                                onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                                className="w-full border p-2 rounded"
                                placeholder="Boshlanish vaqti (HH:MM)"
                            />
                            <input

                                name="end_time"
                                value={editData.end_time}
                                onChange={(e) => setEditData({ ...editData, end_time: e.target.value })}
                                className="w-full border p-2 rounded"
                                placeholder="Tugash vaqti (HH:MM)"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Bekor</button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await instance.patch(`/company/shift-detail/${editData.id}/`, {
                                                name: editData.name,
                                                branch: editData.branch,
                                                start_time: editData.start_time,
                                                end_time: editData.end_time,
                                            })
                                            setEditModalOpen(false)
                                            fetchShifts()
                                        } catch (err) {
                                            console.error("Tahrirlashda xatolik:", err)
                                            alert("Smenani yangilashda xatolik yuz berdi")
                                        }
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </Layout>
        </div>
    )
}

export default EmployeesTable
