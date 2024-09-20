import Navbar from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({
  children
}: {
  children : React.ReactNode
}) => {
  return ( 
    <div className="h-full">
      <div className="h-[80px] fixed z-50 inset-y-0 flex w-full md:pl-56">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px]">
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;