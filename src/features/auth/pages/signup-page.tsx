import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader } from 'lucide-react';
import { z } from "zod";
import { PrimitiveButton } from "src/shared/ui/Buttons/button";
import { useSignUpUser } from "src/shared/api/api-route";
import tala from "src/assets/tala.svg";

const SignUpSchema = z.object({
    email: z.string().email(),
    firstName: z.string({required_error: "First name is required."}).min(1),
    lastName: z.string({required_error: "Last name is required."}).min(1),
    username: z.string({required_error: "Username is required."}).min(4),
    password: z.string({required_error: "Password is required."}).min(8),
});

export function SignUpPage(){
    const navigate = useNavigate();
    const signUpUser = useSignUpUser();
    const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
    const [ error, setError ] = useState<{email: string, firstName: string, lastName: string, userName: string, password: string}>({email: "", firstName: "", lastName: "", userName: "", password: ""});
    
    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const formObject = { 
            email: form.get("email"), 
            firstName: form.get("firstName"), 
            lastName: form.get("lastName"), 
            username: form.get("username"), 
            password: form.get("password") 
        }
        const zod_validation = SignUpSchema.safeParse(formObject);
        if(!zod_validation.success){
            const formatted_error = zod_validation.error.format();
            setError({
                email: formatted_error.email?._errors.join(", ") || '',
                firstName: formatted_error.firstName?._errors.join(", ") || '',
                lastName: formatted_error.lastName?._errors.join(", ") || '',
                userName: formatted_error.username?._errors.join(", ") || '',
                password: formatted_error.password?._errors.join(", ") || ''
            });
            return;
        } else if (zod_validation.success){
            setError({email: "", firstName: "", lastName: "", userName: "", password: ""});
        }

        setIsButtonDisabled(true);
        // Send request to the API
        await signUpUser.mutateAsync({
            email: formObject.email as string,
            first_name: formObject.firstName as string,
            last_name: formObject.lastName as string,
            username: formObject.username as string,
            password: formObject.password as string,
            disabled: false,
        });
        // Notify the user of the result
        navigate('/login');
        setIsButtonDisabled(false);
    }
    
    return(
        <div className="relative flex flex-col items-center justify-center md:h-screen h-max">
            <img src={tala} alt="Tala Logo" className="absolute w-32 h-32 left-0 top-0 mx-6 sm:mx-10"/>
            <div className="h-24 md:h-0 w-screen"/>
            <div className="flex flex-col items-center justify-center gap-8 max-w-[450px] p-6">
                <div className="w-full">
                    <h1 className="text-3xl font-semibold text-stone-800">Sign-up</h1>
                    <h3 className="text-2xl text-stone-400">Create an new <span className="text-pink-500 font-bold">Talahanayan</span> Account.</h3>               
                </div>
                <div className="flex flex-col justify-center gap-2 w-full">
                    <form action="POST" 
                        onSubmit={handleOnSubmit}
                        className="flex flex-col gap-2"
                    >
                        <SignUpItem label="E-mail" placeholder="juandelacruz@email.com" name="email" type="text" error={error.email} />
                        <div className="grid grid-cols-2 gap-2">
                            <SignUpItem label="First Name" placeholder="Juan" name="firstName" type="text" error={error.firstName} />
                            <SignUpItem label="Last Name" placeholder="Dela Cruz" name="lastName" type="text" error={error.lastName} />                            
                        </div>

                        <SignUpItem label="Username" placeholder="Enter a unique username" name="username" type="text" autocomplete="new-username" error={error.userName} />
                        <SignUpItem label="Password" placeholder="Create a strong password" name="password" type="password" autocomplete="new-password" error={error.password} />

                        <PrimitiveButton disabled={isButtonDisabled} type="submit" 
                            className={`w-full rounded-md my-3 py-2 justify-center bg-pink-500 text-white active:bg-pink-600 ${!isButtonDisabled &&'active:-translate-y-1'} disabled:bg-stone-100 disabled:text-stone-500 transition duration-150 ease-in-out`}>
                            {isButtonDisabled ? <Loader size={18} strokeWidth={2} className={`shrink-0 animate-spin`}/> : 'Sign-up'}
                        </PrimitiveButton>
                    </form>      
                </div>
                      
            </div>

        </div>
    )
}

type SignUpItemProps = {label: string, placeholder: string, name: string, type: string, error: string, autocomplete?: string}
function SignUpItem({
    label, 
    placeholder, 
    name, 
    type, 
    error,
    autocomplete
}: SignUpItemProps){
    return(
        <div className="flex flex-col gap-2">
            <label className="text-sm flex flex-row items-center justify-between">{label} </label>
            <input type={type} placeholder={placeholder} name={name} autoComplete={autocomplete}
                className="border border-stone-200 rounded-md px-2 py-1 w-full text-sm placeholder:text-stone-300"/>
            <span className="text-xs text-red-500 font-semibold">{error}</span>
        </div>
    )
}
