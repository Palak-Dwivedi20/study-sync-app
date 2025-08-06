import React from "react";
import { LoginForm } from "../../components/ComponentImport";

function Login() {

    return (
        <div className="min-h-[calc(100vh-60px)] overflow-auto bg-gray-100 w-full">
            <LoginForm />
        </div>
    )
}

export default Login;