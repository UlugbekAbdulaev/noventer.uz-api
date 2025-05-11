import { useEffect, useState } from 'react'
import instance from '../lib/Axios'
import Layout from '../components/Layout/Layout'


interface Employee {
  id: number,
  user: {
    full_name: string,
    gender: "male" | "famale",
    phone_number: string,
    passport_number: string,
    jshshr: string,
    birth_date: string,
    salary_type: string
  },
  user_full_name: string,
  user_role: string,
  branch_name: string,
  position: string,
  salary: number,
  official_salary: number,
  start_time: number,
  end_time: number
}
export interface IBranch {
  additional_phone: string
  address: string
  district: string
  id: number
  latitude: string
  longitude: string
  name: string
  phone: string
  region: string
  working_days: {}
}

const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [branchess, setBranchess] = useState<IBranch[]>([])
  const [selectedBranchId, setSelectedBranchId] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    user: {
      full_name: '',
      gender: "",
      phone_number: "",
      passport_number: "",
      jshshr: "",
      birth_date: "",
      salary_type: ""
    },
    branch_id: "",
    department_id: "",
    shift_id: "",
    position: "",
    salary: "",
    official_salary: ""
  })


  ////////////
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

  const employes_list = (branchId = selectedBranchId) => {
    instance.get(`/employee/employees/branch/${branchId}/?limit=1000'`)
      .then((res) => {
        const unique = new Map<number, Employee>()

        res?.data?.results?.forEach((item: any) => {

          if (!unique.has(item.id)) {
            unique.set(item.id, item)
          }
        })

        setEmployees(Array.from(unique.values()))
        setLoading(false)
        console.log(employees);

      })
      .catch((err) => {
        console.error(err)
        setError("Xodimlar ro'yxatini yuklashda xatolik yuz berdi.")
        setLoading(false)
      })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      user: {
        ...formData.user,
        [e.target.name]: e.target.value,
      },

    });


  }

  const handleSubmit = async () => {
    try {
      await instance.post('/employee/employees/', {
        user: {
          full_name: formData.user.full_name,
          gender: formData.user.gender,
          phone_number: formData.user.phone_number,
          passport_number: formData.user.passport_number,
          jshshr: formData.user.jshshr,
          birth_date: formData.user.birth_date,
          salary_type: formData.user.salary_type
        },
        branch_id: Number(formData.branch_id),
        department_id: formData.department_id ? Number(formData.department_id) : null,
        shift_id: formData.shift_id ? Number(formData.shift_id) : null,
        position: formData.position,
        salary: formData.salary,
        official_salary: formData.official_salary,

      })

      setIsModalOpen(false)
      setFormData({
        user: {
          full_name: '', 
          gender: '', 
          phone_number: '', 
          passport_number: "", 
          jshshr: "", 
          birth_date: "", 
          salary_type: ""
        }, 
        branch_id: "", 
        department_id: "", 
        shift_id: "",
        position: "",
        salary: "",
        official_salary: ""
      })
      employes_list()
    } catch (err) {
      console.error("Smena yaratishda xatolik:", err)
      alert("Smena yaratishda xatolik yuz berdi")
    }
  }
  useEffect(() => {
    branch_list(),
      employes_list()
  }, [selectedBranchId])

  return (
    <div className=''>
      <Layout>
        <div className=" p-6 bg-white shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className='flex items-center gap-2'>
              <h2 className="text-xl font-semibold">Xodimlar ro'yxati</h2>
              <select
                id="branchSelect"
                value={selectedBranchId}
                onChange={(e) => {
                  const newBranchId = parseInt(e.target.value)
                  setSelectedBranchId(newBranchId)
                  employes_list(newBranchId)
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              + Xodim qo‘shish
            </button>
          </div>

          {loading && <p>Yuklanmoqda...</p>}
          {error && <p className="text-red-500">{error}</p>}


          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-3">F.I.SH</th>
                  <th className="p-3">ROLE</th>
                  <th className="p-3">PHONE</th>
                  <th className="p-3">ISHA QABUL QILUVCHI FILIAL</th>
                  <th className="p-3">SMENASI</th>
                  <th className="p-3">TUG&apos;ILGAN SANA</th>
                  <th className="p-3">...</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src="https://profile-images.xing.com/images/cf297b4f112157cf2fa0a7d219032cbe-1/alexander-neumann.1024x1024.jpg"
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{emp?.user_full_name}</span>
                    </td>
                    <td className="p-3">{emp.user_role}</td>
                    <td className="p-3">{emp.user.phone_number}</td>
                    <td className="p-3">{emp.branch_name}</td>
                    <td className="p-3">{emp.start_time || '9:00 - 10:00'}</td>
                    <td className="p-3">{emp.user.birth_date || '01-02-2025'}</td>
                    <td className="p-3">...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
                <h2 className="text-lg font-semibold">Yangi Mijoz Qo'shish</h2>

                <div className='flex gap-3'>
                  <div>
                    <input
                      name="full_name"
                      value={formData.user.full_name}
                      onChange={handleChange}
                      placeholder="Hodim ismi"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="gender"
                      value={formData.user.gender}
                      onChange={handleChange}
                      placeholder="male/famale"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="phone_number"
                      value={formData.user.phone_number}
                      onChange={handleChange}
                      placeholder="Hodim tel:"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="passport_number"
                      value={formData.user.passport_number}
                      onChange={handleChange}
                      placeholder="Hodim passporti"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="jshshr"
                      value={formData.user.jshshr}
                      onChange={handleChange}
                      placeholder="Hodim JSHSHR"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="birth_date"
                      value={formData.user.birth_date}
                      onChange={handleChange}
                      placeholder="Tug'ilgan sana:"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <input
                      name="salary_type"
                      value={formData.user.salary_type}
                      onChange={handleChange}
                      placeholder="Oylik"
                      className="w-full border p-2 rounded"
                    />

                    <select
                      name="branch_id"
                      value={formData.branch_id}
                      onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Filial tanlang</option>
                      {branchess.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                    <input
                      name="Bo'lim"
                      value={formData.department_id}
                      onChange={handleChange}
                      placeholder="department_id"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="shift"
                      value={formData.shift_id}
                      onChange={handleChange}
                      placeholder="shift_id"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="position"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="salary"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="offical_salary"
                      value={formData.official_salary}
                      onChange={handleChange}
                      placeholder="official salary"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </div>





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

          <div className="flex justify-end mt-4 space-x-2">
            {[1, 2, '...', 9, 10].map((page, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded ${page === 1 ? 'bg-blue-500 text-white' : 'text-gray-700'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>



      </Layout >
    </div>
  )
}

export default EmployeesTable
