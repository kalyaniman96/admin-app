import * as Yup from "yup";

const departmentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export default departmentSchema;
