import React from "react";
import { AutoCompleteMultiSelectInput, Option } from "@/components/extensibles/AutoCompleteMultiSelectInput";
import { MovieFormValues } from "./MovieForm";
import { adminApi, AdminMoviePerson, AdminPerson, deleteImage, uploadImage } from "@/apis/admin.api";
import { CreateOptionModal, CreateOptionProps } from "@/components/extensibles/CreateOptionModal";
import { ImageUploadList } from "../../extensibles/ImageUploadList";
import { ToastContextValue } from "@/hooks/useToast";
import { LoadingOverlay } from "@/components/common";
import Image from "next/image";

interface CreatePersonOptionModalProps extends CreateOptionProps<AdminPerson> {
  toast?: ToastContextValue;
}

class CreatePersonOptionModal extends CreateOptionModal<AdminPerson, CreatePersonOptionModalProps> {
  toast?: ToastContextValue;
  constructor(props: CreatePersonOptionModalProps) {
    super(props)
    this.toast = props.toast;
  }
  renderModalContent() {
    const addProfileImage = async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: string
    ) => {
      const file = e.target.files?.[0]
      if (file) {
        try {
          const response = await uploadImage(file, "new-person");
          const newProfileImage = {
            url: response.data.url,
            alt: this.state.creatingOption.name
          }
          // Save new ProfileImage
          this.setState(prev => ({ ...prev, creatingOption: { ...prev.creatingOption, profile_image: newProfileImage } }));
        } catch {
          this.toast?.error("Error when uploading profile image");
        }
      }
    }

    const removeProfileImage = async (url: string, field: string) => {
      await deleteImage(url)
      this.setState(prev => ({ ...prev, creatingOption: { ...prev.creatingOption, profile_image: undefined } }));
    }
    return (
      <>
        <h2 className="text-lg text-white font-semibold mb-4">
          {this.props.label || "Create new option"}
        </h2>

        <div className="flex flex-col gap-3">
          {/* Name field */}
          <div>
            <label className="block text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={this.state.creatingOption?.name || ""}
              onChange={(e) =>
                this.setState({
                  creatingOption: { ...this.state.creatingOption, name: e.target.value },
                })
              }
              className="w-full rounded bg-gray-700 p-2 text-white"
              placeholder="Enter name..."
              required
            />
          </div>

          {/* Gender field */}
          <div>
            <label className="block text-gray-400 mb-1">Gender</label>
            <select
              value={this.state.creatingOption?.gender ?? 0}
              onChange={(e) =>
                this.setState({
                  creatingOption: { ...this.state.creatingOption, gender: parseInt(e.target.value) },
                })
              }
              className="w-full rounded bg-gray-700 p-2 text-white"
            >
              <option value={0}>Unknown</option>
              <option value={1}>Female</option>
              <option value={2}>Male</option>
            </select>
          </div>

          {/* Adult field */}
          <div className="flex items-center gap-2">
            <input
              id="adult"
              type="checkbox"
              checked={this.state.creatingOption?.adult || false}
              onChange={(e) =>
                this.setState({
                  creatingOption: { ...this.state.creatingOption, adult: e.target.checked },
                })
              }
              className="cursor-pointer"
            />
            <label htmlFor="adult" className="text-gray-300">
              Adult
            </label>
          </div>

          {/* Profile Image Field */}
          <div className="flex">
            <ImageUploadList
              addFunction={addProfileImage}
              deleteFunction={removeProfileImage}
              field=""
              images={this.state.creatingOption.profile_image?.url ? [this.state.creatingOption.profile_image] : []}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={this.closeModal}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              onClick={(e) => this.handleSubmit(e)}
            >
              Create
            </button>
          </div>
        </div>
      </>
    );
  }
}

class PersonAutoCompleteInput extends AutoCompleteMultiSelectInput<Option> {

  // Override để render mỗi tag với avatar
  renderSelectedItem(item: Option) {
    const { field } = this.props;
    return (
      <div
        key={Date.now().toString()}
        className="flex h-full justify-between items-center gap-2 bg-white px-3 pt-3 pb-2.5 text-black rounded-full text-sm"
      >
        <Image
          src={item.person.profile_image.url || "/default-avatar.png"}
          alt={item.name}
          className="rounded-full object-cover"
          width={24}
          height={24}
        />
        <span>{item.name}</span>
        {field === 'cast' && (
          <div className="flex gap-2">
            <span>character&apos;s name: </span>
            <input
              className="outline-black"
              type="text"
            />
          </div>
        )}

        {field === 'crew' && (
          <>
            <div className="flex gap-2">
              <span>department:</span>
              <input
                className="outline-black"
                type="text"
              />
            </div>

            <div className="flex gap-2">
              <span>job:</span>
              <input
                className="outline-black"
                type="text"
              />
            </div>
          </>
        )}
        <button
          onClick={() => this.removeItem(item.name, item.id)}
          className="text-white hover:text-gray-300 cursor-pointer"
        >
          ✕
        </button>
      </div>
    );
  }
  renderAllSelectedItem(values: Option[]): React.JSX.Element {
    return (
      <div className="flex flex-col gap-2 mb-2">
        {values.map((item) => this.renderSelectedItem(item))}
      </div>
    )
  }

  renderCreateModal(): React.JSX.Element {
    const handleSubmit = (newPerson: AdminPerson) => {
      this.addItem({ name: newPerson.name, person: newPerson })
    }

    const creatingOption: AdminPerson = {
      adult: true,
      gender: 0,
      name: this.state.inputValue,
      id: "",
      profile_image: {
        url: "",
        alt: this.state.inputValue
      }
    }

    return (
      <CreatePersonOptionModal creatingOption={creatingOption} handleSubmit={handleSubmit} label="Create new person" toast={this.toast} />
    )
  }
}

interface PersonInputProps {
  label: string;
  field: keyof MovieFormValues;
  onChange: (field: keyof MovieFormValues, newItems: Option[]) => void;
  values: AdminMoviePerson[];
  toast: ToastContextValue;
}

export default function PersonInput({
  label,
  field,
  onChange,
  values,
  toast
}: PersonInputProps) {

  const processedValues = values.map(v => ({ ...v, name: v.person.name }))

  const fetchSuggestions = async (query: string) => {
    const { data } = await adminApi.getPersons(query);
    const mappedData: Option[] = [];

    console.log(data)

    data.map(p => {
      mappedData.push({
        ...(
          field === 'cast' ?
            {
              character: ""
            } :
            field === 'crew' ?
              {
                department: "",
                job: ""
              } : {}
        ),
        person: p,
        id: "",
        name: p.name
      })
    });

    return mappedData;
  }

  return (
    <PersonAutoCompleteInput
      label={label}
      fetchSuggestions={fetchSuggestions}
      field={field}
      onChange={onChange}
      values={processedValues}
      toast={toast}
    />
  )
}
