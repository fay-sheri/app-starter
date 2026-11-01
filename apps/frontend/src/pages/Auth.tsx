import { BasicLayout } from "../layouts/BasicLayout";
import { Nav } from "../features/Nav/index";
import { Login } from "../features/Auth/Login";
import { Register } from "../features/Auth/Register"
import { useState } from "react";

export function Auth() {
  const [registerMode, setRegisterMode] = useState(false);
  const content = (
    <div className="flex flex-col flex-auto justify-center items-center bg-blue-400 h-full">
      {registerMode ? <Register setRegisterMode={setRegisterMode}/> : <Login setRegisterMode={setRegisterMode}/>}
    </div>
  );
  
  return <BasicLayout header={<Nav />} content={content} />;
}
 