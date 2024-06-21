import * as Yup from "yup";

const patientSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  email: Yup.string().required("This field is required"),
  phone: Yup.string().required("This field is required"),
  department: Yup.string().required("This field is required"),
  //   gender: Yup.string().required("Gender is required"),
  medicalHistory: Yup.string().required("This field is required"),
  currentMedications: Yup.string().required("This field is required"),
  emergencyContactName: Yup.string().required("This field is required"),
  emergencyContactNumber: Yup.string().required("This field is required"),
  //   emergencyContactRelation: Yup.string().required("This field is required"),
});

export default patientSchema;
