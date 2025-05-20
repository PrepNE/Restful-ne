import React from "react"
import { Layout, Typography } from "antd";
import Logo from "@/components/shared/Logo";
import { Link } from "react-router-dom";


const AuthLayout = ({ children }: { children: React.ReactElement }) => {

  const { Text } = Typography

  return (
    <Layout className="site-layout bg-white min-h-screen flex flex-col text-[#333] items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-4 max-w-7xl w-full">
        {children}

        <div className="hidden md:block lg:block lg:h-[400px] md:h-[300px] max-md:mt-10">

          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          <img src="/login.png" className="w-full h-full object-cover" alt="Experience" />
        </div>
      </div>
    </Layout>
  )
}

export default AuthLayout