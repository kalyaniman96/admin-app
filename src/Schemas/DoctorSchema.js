import * as Yup from "yup";

const doctorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  department: Yup.string().required("Department is required"),
  gender: Yup.string().required("Gender is required"),
  qualification: Yup.string().required("Qualification is required"),
  experience: Yup.string().required("Experience is required"),
  hospitalAffiliation: Yup.string().required("Affiliation is required"),
  licenseNumber: Yup.string().required("License number is required"),
  address: Yup.string().required("Address is required"),
});

export default doctorSchema;
