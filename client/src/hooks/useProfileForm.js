// src/hooks/useProfileForm.js
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from "../lib/validation/profileSchema";

const useProfileForm = (
    defaultValues = {
        avatar: '',
        coverImage: "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    }) => {
    return useForm({
        defaultValues,
        resolver: yupResolver(profileSchema),
        mode: "onChange"
    });
};

export { useProfileForm };