
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "../ui/PageTransition";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition>
        <main className="flex-1">{children}</main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Layout;
