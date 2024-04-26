import { useFormContext } from "react-hook-form";


export function TextArea({ ...props }) {
    const { register } = useFormContext();

    return (
        <textarea 
            {...props} 
            {...register(props.name)} 
            id={props.name}
        />
    )
}