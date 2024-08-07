import { useRef } from "react";
import { useForm } from "../useForm";
import { RenderCounter } from "./util/RenderCounter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { successValidator } from "./util/successValidator";
import { Isolate } from "../isolation";
import { Field } from "../field";

describe("Isolate", () => {
  it("should be able to isloate rerenders on the fly", async () => {
    const submit = vi.fn();
    const TestComp = () => {
      const form = useForm({
        defaultValues: { foo: "bar" },
        validator: successValidator,
        handleSubmit: submit,
      });

      const renderCounter = useRef(0);
      renderCounter.current++;

      return (
        <form {...form.getFormProps()} data-testid="form">
          <input data-testid="foo" {...form.field("foo").getInputProps()} />
          <pre data-testid="foo-touched">
            {form.touched("foo") ? "true" : "false"}
          </pre>
          <RenderCounter data-testid="outer-render-count" />

          <Isolate
            scope={form.scope()}
            render={(iso) => (
              <>
                <pre data-testid="iso-value">{iso.value("foo")}</pre>
                <RenderCounter data-testid="iso-render-count" />
              </>
            )}
          />
        </form>
      );
    };

    render(<TestComp />);
    expect(screen.getByTestId("outer-render-count")).toHaveTextContent("1");
    expect(screen.getByTestId("iso-render-count")).toHaveTextContent("1");
    expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
    expect(screen.getByTestId("foo")).toHaveValue("bar");
    expect(screen.getByTestId("iso-value")).toHaveTextContent("bar");

    await userEvent.type(screen.getByTestId("foo"), "test");

    expect(screen.getByTestId("outer-render-count")).toHaveTextContent("1");
    expect(screen.getByTestId("iso-render-count")).toHaveTextContent("5");
    expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
    expect(screen.getByTestId("foo")).toHaveValue("bartest");
    expect(screen.getByTestId("iso-value")).toHaveTextContent("bartest");

    await userEvent.click(screen.getByTestId("outer-render-count")); // blur

    expect(screen.getByTestId("outer-render-count")).toHaveTextContent("2");
    expect(screen.getByTestId("iso-render-count")).toHaveTextContent("6");
    expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
    expect(screen.getByTestId("foo")).toHaveValue("bartest");
    expect(screen.getByTestId("iso-value")).toHaveTextContent("bartest");
  });
});

describe("Field", () => {
  it("should be able to isloate rerenders on the fly", async () => {
    const submit = vi.fn();
    const TestComp = () => {
      const form = useForm({
        defaultValues: { foo: "bar" },
        validator: successValidator,
        handleSubmit: submit,
      });

      const renderCounter = useRef(0);
      renderCounter.current++;

      return (
        <form {...form.getFormProps()} data-testid="form">
          <input data-testid="foo" {...form.field("foo").getInputProps()} />
          <pre data-testid="foo-touched">
            {form.touched("foo") ? "true" : "false"}
          </pre>
          <RenderCounter data-testid="outer-render-count" />

          <Field scope={form.scope("foo")}>
            {(iso) => (
              <>
                <pre data-testid="iso-value">{iso.value()}</pre>
                <RenderCounter data-testid="iso-render-count" />
              </>
            )}
          </Field>
        </form>
      );
    };

    render(<TestComp />);
    expect(screen.getByTestId("outer-render-count")).toHaveTextContent("1");
    expect(screen.getByTestId("iso-render-count")).toHaveTextContent("1");
    expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
    expect(screen.getByTestId("foo")).toHaveValue("bar");
    expect(screen.getByTestId("iso-value")).toHaveTextContent("bar");

    await userEvent.type(screen.getByTestId("foo"), "test");

    expect(screen.getByTestId("outer-render-count")).toHaveTextContent("1");
    expect(screen.getByTestId("iso-render-count")).toHaveTextContent("5");
    expect(screen.getByTestId("foo-touched")).toHaveTextContent("false");
    expect(screen.getByTestId("foo")).toHaveValue("bartest");
    expect(screen.getByTestId("iso-value")).toHaveTextContent("bartest");

    await userEvent.click(screen.getByTestId("outer-render-count")); // blur

    expect(screen.getByTestId("outer-render-count")).toHaveTextContent("2");
    expect(screen.getByTestId("iso-render-count")).toHaveTextContent("6");
    expect(screen.getByTestId("foo-touched")).toHaveTextContent("true");
    expect(screen.getByTestId("foo")).toHaveValue("bartest");
    expect(screen.getByTestId("iso-value")).toHaveTextContent("bartest");
  });
});
