// VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailRequest } from '../../api/UserService';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!uidb64 || !token) {
                toast.error("link de verificación invalido");
                navigate("/login");
                setLoading(false);
                return;
            }

            try {
                await verifyEmailRequest(uidb64, token);
                toast.success("Cuenta verificada, ¡Bienvenido!");
                navigate("/login");
            } catch (error) {
                toast.error("El link ha expirado o es invalido");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [uidb64, token, navigate]);

    if (loading) {
        return <p>Verificando...</p>;
    }

    return <p>¡Correo verificado exitosamente!</p>;
};

export default VerifyEmail;
