import * as Yup from "yup";

const appointmentSchema = Yup.object().shape({
  department: Yup.string().required("Select department"),
  doctor: Yup.string().required("Select doctor"),
  patient: Yup.string().required("Select patient"),
  date: Yup.string().required("Select a date"),
});

export default appointmentSchema;
