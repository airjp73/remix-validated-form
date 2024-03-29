import { DataFunctionArgs } from "@remix-run/node";
import { withYup } from "@remix-validated-form/with-yup";
import { validationError, ValidatedForm } from "remix-validated-form";
import * as yup from "yup";
import { Input } from "~/components/Input";
import { SubmitButton } from "~/components/SubmitButton";

const schema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
});

const validator = withYup(schema);

export const action = async (args: DataFunctionArgs) => {
  return validationError(
    {
      fieldErrors: { lastName: "Error" },
      formId: "test-form",
    },
    { firstName: "Bob", lastName: "Ross" }
  );
};

export default function CustomServerValidationFocusInvalidField() {
  return (
    <ValidatedForm validator={validator} method="post" id="test-form">
      <Input name="firstName" label="First Name" />
      <Input name="lastName" label="Last Name" />
      <SubmitButton />
    </ValidatedForm>
  );
}
