import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "../useForm";
import { successValidator } from "./util/successValidator";
import { controlInput } from "./util/controlInput";

it("should reset the whole form", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      defaultValues: {
        foo: "bar",
        baz: { a: "quux" },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" {...form.field("foo").getInputProps()} />
        <pre data-testid="foo-touched">
          {form.touched("foo") ? "true" : "false"}
        </pre>

        <input data-testid="baz.a" {...controlInput(form.field("baz.a"))} />
        <pre data-testid="baz.a-touched">
          {form.touched("baz.a") ? "true" : "false"}
        </pre>

        <button
          type="button"
          data-testid="reset"
          onClick={() => form.resetForm()}
        />
      </form>
    );
  };

  render(<TestComp />);
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("bartest");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("baz.a")).toHaveValue("quux");
  expect(screen.getByTestId("foo")).toHaveValue("bar");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");
});

it("should reset individual fields", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      defaultValues: {
        foo: "bar",
        baz: { a: "quux" },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" {...form.field("foo").getInputProps()} />
        <pre data-testid="foo-touched">
          {form.touched("foo") ? "true" : "false"}
        </pre>

        <input data-testid="baz.a" {...controlInput(form.field("baz.a"))} />
        <pre data-testid="baz.a-touched">
          {form.touched("baz.a") ? "true" : "false"}
        </pre>

        <button
          type="button"
          data-testid="reset"
          onClick={() => form.resetField("foo")}
        />
      </form>
    );
  };

  render(<TestComp />);
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("bartest");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("foo")).toHaveValue("bar");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("true");
});

it("should reset the whole form using custom initial values", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      defaultValues: {
        foo: "bar",
        baz: { a: "quux" },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" {...form.field("foo").getInputProps()} />
        <pre data-testid="foo-touched">
          {form.touched("foo") ? "true" : "false"}
        </pre>

        <input data-testid="baz.a" {...controlInput(form.field("baz.a"))} />
        <pre data-testid="baz.a-touched">
          {form.touched("baz.a") ? "true" : "false"}
        </pre>

        <button
          type="button"
          data-testid="reset"
          onClick={() =>
            form.resetForm({
              foo: "testing 123",
              baz: { a: "testing 456" },
            })
          }
        />
      </form>
    );
  };

  render(<TestComp />);
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("bartest");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("foo")).toHaveValue("testing 123");
  expect(screen.getByTestId("baz.a")).toHaveValue("testing 456");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");
});

it("should reset individual fields using custom initial values", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      defaultValues: {
        foo: "bar",
        baz: { a: "quux" },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" {...form.field("foo").getInputProps()} />
        <pre data-testid="foo-touched">
          {form.touched("foo") ? "true" : "false"}
        </pre>

        <input data-testid="baz.a" {...controlInput(form.field("baz.a"))} />
        <pre data-testid="baz.a-touched">
          {form.touched("baz.a") ? "true" : "false"}
        </pre>

        <button
          type="button"
          data-testid="reset"
          onClick={() => form.resetField("foo", "testing 123")}
        />
      </form>
    );
  };

  render(<TestComp />);
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("bartest");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("foo")).toHaveValue("testing 123");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("true");
});

it("should reset the whole form when a reset button is clicked", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      defaultValues: {
        foo: "bar",
        baz: { a: "quux" },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" {...form.field("foo").getInputProps()} />
        <pre data-testid="foo-touched">
          {form.touched("foo") ? "true" : "false"}
        </pre>

        <input data-testid="baz.a" {...controlInput(form.field("baz.a"))} />
        <pre data-testid="baz.a-touched">
          {form.touched("baz.a") ? "true" : "false"}
        </pre>

        <button type="reset" data-testid="reset" />
      </form>
    );
  };

  render(<TestComp />);
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("bartest");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("quuxtest");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("baz.a")).toHaveValue("quux");
  expect(screen.getByTestId("foo")).toHaveValue("bar");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");
});

it("should reset inputs not registered with RVF", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      defaultValues: {
        foo: "",
        baz: { a: "" },
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" name="foo" />
        <input data-testid="baz.a" name="baz.a" />
        <button type="reset" data-testid="reset" />
      </form>
    );
  };

  render(<TestComp />);
  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("test");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("test");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("baz.a")).toHaveValue("");
  expect(screen.getByTestId("foo")).toHaveValue("");
});

it("should reset even with no default values", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useForm({
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input data-testid="foo" {...form.field("foo").getInputProps()} />
        <pre data-testid="foo-touched">
          {form.touched("foo") ? "true" : "false"}
        </pre>

        <input data-testid="baz.a" {...form.field("baz.a").getInputProps()} />
        <pre data-testid="baz.a-touched">
          {form.touched("baz.a") ? "true" : "false"}
        </pre>

        <button
          type="button"
          data-testid="reset"
          onClick={() => form.resetForm()}
        />
      </form>
    );
  };

  render(<TestComp />);
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.type(screen.getByTestId("foo"), "test");
  expect(screen.getByTestId("foo")).toHaveValue("test");

  await userEvent.type(screen.getByTestId("baz.a"), "test");
  expect(screen.getByTestId("baz.a")).toHaveValue("test");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");

  await userEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("foo")).toHaveValue("");
  expect(screen.getByTestId("baz.a")).toHaveValue("");
  expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
  expect(screen.getByTestId("baz.a-touched")).toHaveTextContent("false");
});
