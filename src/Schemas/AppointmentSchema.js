import * as Yup from "yup";

const appointmentSchema = Yup.object().shape({
  doctorName: Yup.string().required("Name is required"),
  patientName: Yup.string().required("Name is required"),
});

export default appointmentSchema;
