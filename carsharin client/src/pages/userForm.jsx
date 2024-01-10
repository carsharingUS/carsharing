import {set, useForm} from 'react-hook-form'
import { createUser, deleteUser, updateuser, getUser } from '../api/User.api'
import {useNavigate, useParams} from 'react-router-dom'
import { useEffect } from 'react';
import {toast} from 'react-hot-toast';

export function UserFormPage(){

    const {register, handleSubmit, formState: { errors }, setValue} = useForm();

    const navigate = useNavigate()
    const params = useParams()

    const onSubmit = handleSubmit(async data => {
        if (params.id){
            await updateuser(params.id, data);
            toast.success('Usuario actualizado', {
                position:"bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
        }else{
            await createUser(data);
            toast.success('Usuario creado', {
                position:"bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
        }
        navigate("/user");
    });

    useEffect(() => {
    async function loadUser() {
        if (params.id){
            const res = await getUser(params.id);
            setValue("username", res.data.username);
            setValue("description", res.data.description);
            setValue("password", res.data.password);
        }
    }
    loadUser();
    }, []);

    return (
        
        <div className='max-w-xl mx-auto'>

            <form onSubmit={onSubmit}>
                <input type="text" placeholder="username" {...register("username", {required: true})} className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'/>
                {errors.username && <span>Username is requiered</span>}

                <textarea rows="3" placeholder="Description" {...register("description", {required: false})}  className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'></textarea>

                <input type="password" placeholder="password" {...register("password", {required: true})}  className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'/>
                {errors.password && <span>Password is requiered</span>}

                <button className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'>Save</button>
            </form>

            {params.id && (
                <div className='flex justify-end'>
                    <button className='bg-red-500 p-3 rounded-lg w-48 mt-3' onClick={async () => {

                        const aceptado = window.confirm('are you sure')
                        if(aceptado){
                            await deleteUser(params.id);
                            toast.success('Usuario eliminado', {
                                position:"bottom-right",
                                style: {
                                    background: "#101010",
                                    color: "#fff"
                                }
                            });
                navigate("/user");
            }
            }}>Delete</button>
                    
                </div>
            )}
        </div>
    );
}