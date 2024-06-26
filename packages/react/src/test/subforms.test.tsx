import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormScope, createValidator } from "@rvf/core";
import { useForm } from "../useForm";
import userEvent from "@testing-library/user-event";
import { successValidator } from "./util/successValidator";
import { controlInput } from "./util/controlInput";
import { useFormScope } from "../useFormScope";

it("should be able to create scoped subforms", async () => {
  const submit = vi.fn();
  const NameForm = ({ form }: { form: FormScope<{ name: string }> }) => {
    const iso = useFormScope(form);

    return (
      <div>
        <input data-testid="name" {...controlInput(iso.field("name"))} />
      </div>
    );
  };

  const PersonForm = () => {
    const form = useForm({
      defaultValues: {
        person: {
          name: "",
        },
      },
      validator: createValidator({
        validate: (data) =>
          Promise.resolve({
            data: data as { person: { name: string } },
            error: undefined,
          }),
      }),
      handleSubmit: submit,
    });

    const personForm = form.scope("person");
    expectTypeOf(personForm).toEqualTypeOf<FormScope<{ name: string }>>();

    return (
      <form {...form.getFormProps()} data-testid="form">
        <NameForm form={personForm} />
      </form>
    );
  };

  render(<PersonForm />);

  await userEvent.type(screen.getByTestId("name"), "bob");
  expect(screen.getByTestId("name")).toHaveValue("bob");

  fireEvent.submit(screen.getByTestId("form"));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    {
      person: {
        name: "bob",
      },
    },
    expect.any(FormData),
    {},
  );
});

it("should be able to create subforms of arrays", async () => {
  const submit = vi.fn();
  const NameForm = ({ form }: { form: FormScope<{ name: string }> }) => {
    const iso = useFormScope(form);

    return (
      <div>
        <input data-testid="name" {...controlInput(iso.field("name"))} />
      </div>
    );
  };

  const PersonForm = () => {
    const defaultValues = {
      people: [
        {
          name: "",
        },
      ],
    };
    const form = useForm({
      defaultValues,
      validator: createValidator({
        validate: (data) =>
          Promise.resolve({
            data: data as { people: { name: string }[] },
            error: undefined,
          }),
      }),
      handleSubmit: submit,
    });

    expectTypeOf(form.scope("people[0]")).toEqualTypeOf<
      FormScope<{ name: string }>
    >();

    expectTypeOf(form.scope(`people[${0 as number}]`)).toEqualTypeOf<
      FormScope<{ name: string }>
    >();

    const peopleForm = useFormScope(form.scope("people"));
    expectTypeOf(peopleForm.scope(`${0 as number}`)).toEqualTypeOf<
      FormScope<{ name: string }>
    >();

    return (
      <form {...form.getFormProps()} data-testid="form">
        <NameForm form={form.scope("people[0]")} />
      </form>
    );
  };

  render(<PersonForm />);

  await userEvent.type(screen.getByTestId("name"), "bob");
  expect(screen.getByTestId("name")).toHaveValue("bob");

  fireEvent.submit(screen.getByTestId("form"));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    {
      people: [
        {
          name: "bob",
        },
      ],
    },
    expect.any(FormData),
    {},
  );
});

it("should memoize subform creation", async () => {
  const submit = vi.fn();
  const Form = () => {
    const form = useForm({
      defaultValues: {
        foo: { bar: { baz: { bap: "" } } },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    expect(form.scope("foo")).toBe(form.scope("foo"));
    expect(form.scope("foo.bar")).toBe(form.scope("foo.bar"));
    expect(form.scope("foo.bar.baz")).toBe(form.scope("foo.bar.baz"));
    expect(form.scope("foo.bar.baz.bap")).toBe(form.scope("foo.bar.baz.bap"));

    const fooForm = useFormScope(form.scope("foo"));
    expect(fooForm.scope("bar")).toBe(form.scope("foo.bar"));
    expect(fooForm.scope("bar.baz")).toBe(form.scope("foo.bar.baz"));
    expect(fooForm.scope("bar.baz.bap")).toBe(form.scope("foo.bar.baz.bap"));

    const barForm = useFormScope(form.scope("foo.bar"));
    expect(barForm.scope("baz")).toBe(form.scope("foo.bar.baz"));
    expect(barForm.scope("baz.bap")).toBe(form.scope("foo.bar.baz.bap"));

    const bazForm = useFormScope(form.scope("foo.bar.baz"));
    expect(bazForm.scope("bap")).toBe(form.scope("foo.bar.baz.bap"));

    return null;
  };
  render(<Form />);
});
