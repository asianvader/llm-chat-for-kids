import { FC } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

type AddProfileButtonProps = {
  setShowModal: (showModal: boolean) => void;
};
const AddProfileButton: FC<AddProfileButtonProps> = ({ setShowModal }) => {
  /**
   * Handles the click event for the Add Profile button.
   */
  const handleOnClick = () => {
    setShowModal(true);
  };
  return (
    <div className="flex items-center justify-center pt-6">
      <button
        className="roby-button roby-button-primary mt-2"
        onClick={handleOnClick}
      >
        <PlusIcon className="h-5 w-5" /> Add a profile
      </button>
    </div>
  );
};

export default AddProfileButton;
