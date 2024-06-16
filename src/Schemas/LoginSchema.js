import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(4, "Password must contain at least 4 characters")
    .required("Password is required"),
});

export default loginSchema;
