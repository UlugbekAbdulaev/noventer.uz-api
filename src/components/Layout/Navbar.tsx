import { useEffect, useState } from "react";
import instance from "../../lib/Axios"



function Navbar() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    instance
      .get("/accounts/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        setUser(res.data)
        console.log(res.data);

      })
      .catch((err) => {
        console.error(err);

      });
  }, []);


  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <div className="flex">
          <img src="/logo/Union.png" alt="" />
          <h1 className="font-bold text-3xl pt-2 pl-3">Noventer</h1>
        </div>
        <div className="pr-10 pt-5 flex">
          <div className="w-[40px] h-[40px] ">
          <img src={user?.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
          </div>
          <p>{user?.full_name}</p>
        </div>
      </div>


      <hr />
    </div>
  )
}

export default Navbar