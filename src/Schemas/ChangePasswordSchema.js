import * as Yup from "yup";

const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, "Password must contain at least 4 characters")
    .required("Password is required"),
  confirmPassword: Yup.string().required("Please confirm new password"),
});

export default changePasswordSchema;
