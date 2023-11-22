import { FC } from "react";

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
    <div className="flex items-center justify-center pt-6 ">
      <button
        className=" bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
        onClick={handleOnClick}
      >
        Add new profile
      </button>
    </div>
  );
};

export default AddProfileButton;
