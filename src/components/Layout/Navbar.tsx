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
          <div className="w-[60px] h-[60px] ">
          <img src="/prof.jpg" alt="avatar" className="w-12 h-12 rounded-full" />
          </div>
          <p className="pt-2"><b>{user?.full_name}</b></p>
        </div>
      </div>


      <hr />
    </div>
  )
}

export default Navbar