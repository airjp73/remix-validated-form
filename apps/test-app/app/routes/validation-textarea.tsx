import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Input } from "~/components/Input";
import { SubmitButton } from "~/components/SubmitButton";
import { Textarea } from "~/components/Textarea";

const validator = withZod(
  zfd.formData({
    longText: zfd.text(),
    shortText: zfd.text(),
  })
);

export default function FrontendValidation() {
  return (
    <ValidatedForm validator={validator} method="post">
      <Textarea name="longText" label="Long Text" />
      <Input name="shortText" type="text" label="Short Text" />
      <SubmitButton />
    </ValidatedForm>
  );
}
