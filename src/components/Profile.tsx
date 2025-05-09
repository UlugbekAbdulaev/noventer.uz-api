

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../lib/Axios";
import Layout from "./Layout/Layout";
import bg from '/pbg.png'

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
    instance
      .get("/accounts/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        setUser(res.data);
        setLoading(false);
        console.log(res);

      })
      .catch((err) => {
        console.error(err);
        setError("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="">
      <Layout>
        <div className=" bg-cover bg-center px-10 py-20 text-white rounded-2xl flex gap-52 "
          style={{ backgroundImage: `url(${bg})` }}>

          <div className="flex gap-10">
            <div className="bg-white text-blue-500 text-7xl font-bold w-[100px] text-center rounded-3xl p-3">
              A
            </div>
            <div>
              <h1 className="text-xl">Hush kelibsiz!</h1>
              <h1 className="text-4xl font-bold">{user?.full_name}</h1>
              <div className="mt-3 px-2 bg-white text-blue-500 w-[70px] rounded-lg">{user?.role}</div>
            </div>
          </div>
          <div>
            <img src="/Balance.png" alt="balance cart" />
          </div>
        </div>


        <div className=" p-2" >
          <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Foydalanuvchi ma'lumotlari</h1>
            <div className="flex gap-20">
              <div>
                <p><strong>Ism:</strong> {user?.full_name}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Tug'ilgan sanasi:</strong> {user?.birth_date}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Gender:</strong> {user?.gender}</p>
              </div>
            </div>


          </div>
        </div>
      </Layout>





    </div>
  );
}

export default Profile;
