import { Outlet } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <TopHeader />
      <main style={{ maxWidth: 600, margin: "0 auto" }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
