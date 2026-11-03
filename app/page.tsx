'use client'




export default function Home() {
  return (
      <div className="hero-content flex-col max-w-3xl mx-auto mt-10 mb-10">
    <div>
      <h1 className="text-xl font-bold mt-5">Welcome To My Profile</h1>
      <div className="flex flex-row font-bold mt-4 bg-gray-100 p-5 rounded-2xl shadow-2xl">
        <img src="/stdempimg.gif" alt="user" className="w-40 h-40  object-cover rounded-2xl" />
        <div className="flex flex-col pl-6">
      <p className="py-6">
       68094495, อิทธิวรรธน์ ขุนพิชัย
       <br /> 
       สาขาวิชา: วิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์
       <br />
       เป้าหมายสายงานที่ต้องการ: Back-End Developer
       <br />
        
      </p>
     </div>
      </div>
      
      
    </div>
  </div>

  );
}
