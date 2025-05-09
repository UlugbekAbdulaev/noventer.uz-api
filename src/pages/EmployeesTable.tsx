import { useEffect, useState } from 'react'
import instance from '../lib/Axios'

import Layout from '../components/Layout/Layout'

interface Employee {
  "id": number,
  "user": {
    "full_name": string,
    "gender": "male" | "famale",
    "phone_number": string,
    "passport_number": string,
    "jshshr": string,
    "birth_date": string,
    "salary_type": string
  },
  "user_full_name": string,
  "user_role": string,
  "branch_name": string,
  "position": string,
  "salary": string,
  "official_salary": string,
  "start_time": string,
  "end_time": string
}

const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    instance.get('/employee/employees/branch/1/')
      .then((res) => {
        const unique = new Map<number, Employee>()
        console.log(res.data);

        res?.data?.results?.forEach((item: any) => {

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

  return (
    <div className=''>
      <Layout>
        <div className=" p-6 bg-white shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Xodimlar ro'yxati</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
