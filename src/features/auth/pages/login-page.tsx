import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Loader } from 'lucide-react';
import { z } from "zod";
import { useAuth } from "src/shared/api/api-auth.tsx";
import { PrimitiveButton } from "src/shared/ui/Buttons/button";
import { AppContext } from "src/App";
import tala from "src/assets/tala.svg";

const LogInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LogInPage() {
  const { addToast } = useContext(AppContext);
  const navigate = useNavigate();
  const { logIn } = useAuth(); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const formData = Object.fromEntries(form.entries());

    try {
      LogInSchema.parse(formData);
    } catch (error) {
      addToast("Invalid form data.", "error");
      return;
    }

    const urlencoded = new URLSearchParams();
    const username = event.currentTarget.username.value;
    urlencoded.append("username", username);
    urlencoded.append("password", event.currentTarget.password.value);

    setIsButtonDisabled(true);

    const success = await logIn(urlencoded);
    if (success) {
      addToast("Log-in successful.", "success");
      localStorage.setItem("username", username || "");
      navigate("/home");
    } else {
      addToast("Log-in failed.", "error");
    }

    setIsButtonDisabled(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <img src={tala} alt="Tala Logo" className="absolute w-32 h-32 left-0 top-0 mx-6 sm:mx-10"/>
      <div className="flex flex-col items-center justify-center gap-8 max-w-[450px] p-6 mb-8">
        <div className="w-full">
          <h1 className="text-3xl font-semibold text-stone-800">Welcome!</h1>
          <h3 className="text-2xl text-stone-400">
            Log In to your <span className="text-pink-500 font-bold">Talahanayan</span> Account.
          </h3>               
        </div>
        <div className="flex flex-col justify-center gap-2 w-full">
          <form onSubmit={handleOnSubmit} className="flex flex-col gap-2">
            <label className="text-sm">Username</label>
            <input type="text" name="username" placeholder="Enter your username" autoComplete="current-username" className="border border-stone-200 rounded-md px-2 py-1 w-full text-sm"/>
            <label className="text-sm">Password</label>
            <input type="password" placeholder="Type your current password" autoComplete="current-password" name="password" className="border border-stone-200 rounded-md px-2 py-1 w-full text-sm"/>
            <PrimitiveButton disabled={isButtonDisabled} type="submit" 
              className={`w-full rounded-md my-3 py-2 justify-center bg-pink-500 text-white active:bg-pink-600 ${!isButtonDisabled && 'active:-translate-y-1'} disabled:bg-stone-100 disabled:text-stone-500 transition duration-150 ease-in-out`}>
              {isButtonDisabled ? <Loader size={18} strokeWidth={2} className={`shrink-0 animate-spin`}/> : 'Log In'}
            </PrimitiveButton>
          </form>     
          <hr />
          <label className="text-xs text-center text-semibold text-stone-500">
            Don't have an account? Sign-up now.
          </label>
          <PrimitiveButton 
            onClick={() => navigate("/signup")}
            className={`w-full rounded-md py-2 justify-center text-pink-500 border-2 border-pink-500 active:bg-pink-500 active:text-white transition duration-150 ease-in-out`}>
            Sign Up
          </PrimitiveButton>    
        </div>
      </div>
    </div>
  );
}
