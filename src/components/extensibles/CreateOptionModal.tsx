import React from "react";
import { AnimatedModalComponent, AnimatedModalState } from "./AnimatedModalComponent";
import { Option } from "./AutoCompleteMultiSelectInput";
import { ToastContextValue, useToast } from "@/hooks/useToast";
import { LoadingOverlay } from "../common";

export interface CreateOptionState<T extends Option> {
  creatingOption: T;
  showModal: boolean;
};

export interface CreateOptionProps<T extends Option> {
  creatingOption: T;
  label?: string;
  handleSubmit: (option: T) => void;
}

export class CreateOptionModal<
  T extends Option,
  P extends CreateOptionProps<T> = CreateOptionProps<T>
> extends AnimatedModalComponent<P, CreateOptionState<T>> {
  constructor(props: P) {
    super(props);
  }

  componentDidMount(): void {

    this.setState({
      creatingOption: this.props.creatingOption ?? {
        name: "Hello world"
      },
      showModal: false,
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { handleSubmit } = this.props;

    handleSubmit(this.state.creatingOption);

    this.closeModal();
  };
  renderModalContent() {
    const { handleSubmit, label } = this.props;
    const { creatingOption } = this.state;

    return (
      <>
        <h2 className="text-lg text-white font-semibold mb-4">
          {label || "Create new option"}
        </h2>

        <form onSubmit={() => handleSubmit(creatingOption)} className="flex flex-col gap-3">
          <input
            type="text"
            value={creatingOption?.name}
            onChange={(e) =>
              this.setState({ creatingOption: { ...creatingOption, name: e.target.value } })
            }
            className="w-full rounded bg-gray-700 p-2 text-white"
            placeholder="Enter name..."
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={this.closeModal}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </>
    );
  }

  render() {
    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={this.openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New
        </button>

        {this.renderModalWrapper()}
      </div>
    );
  }
}
