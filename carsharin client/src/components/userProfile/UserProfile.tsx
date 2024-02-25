import React, {
  ChangeEvent,
  HtmlHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { useAuthStore } from "../../store/auth";
import { Travel, Token } from "../../Interfaces";
import * as jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { edit_user, get_solo_user } from "../../api/UserService";
import { getUserTravels } from "../../api/TravelService";
import Loader from "../Loader";

const UserProfileComponent = () => {
  const [show, setShow] = useState(true);
  const [stateName, setStateName] = useState<string>("");
  const [stateLast, setStateLast] = useState<string>("");
  const [stateDescription, setStateDescription] = useState<string>("");
  const [statePhone, setStatePhone] = useState<string>("");
  const [stateSex, setStateSex] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode.jwtDecode(token);

  const id = tokenDecoded.user_id;

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => get_solo_user(id),
  });

  useEffect(() => {
    if (user) {
      setStateName(user.name);
      setStateLast(user.last_name);
      setStateSex(user.sex);
      setStateDescription(user.description);
      setStatePhone(user.phone);
      setImage(user.avatar);
    }
  }, [user]);

  const queryClient = useQueryClient();

  const editProfileMut = useMutation({
    mutationFn: edit_user,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated!");
      setShow(true);
    },
    onError: () => {
      toast.error("Error!");
      setShow(true);
    },
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["travels"],
    queryFn: getUserTravels,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (image !== null && image !== user.avatar) {
      editProfileMut.mutate({
        name: stateName,
        last_name: stateLast,
        avatar: image,
        description: stateDescription,
        phone: statePhone,
        sex: stateSex,
        username: user.username,
        email: user.email,
      });
    } else {
      editProfileMut.mutate({
        name: stateName,
        last_name: stateLast,
        avatar: null,
        description: stateDescription,
        phone: statePhone,
        sex: stateSex,
        username: user.username,
        email: user.email,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsHovered(false);
  };

  const removeImage = () => {
    setImage(null);
    setIsHovered(false);
  };

  if (user === undefined) return <p>No user here!</p>;

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

  console.log(image);

  return (
    <div className="flex justify-center pt-[50px]">
      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {show ? (
          <>
            <div className="flex flex-col items-center pb-10">
              {user && user.avatar !== undefined && (
                <img
                  className="w-32 h-24 mb-3 mt-3 rounded-full shadow-lg"
                  src={`http://localhost:8000${user.avatar}`}
                  alt={user.username}
                />
              )}
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {user.username}
              </h5>
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {user.email}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.name} {user.last_name}
              </span>
              <div className="flex mt-4 md:mt-6">
                <button
                  onClick={() => setShow(false)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Edit profile
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Travel Origin
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Travel Destination
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3">
                      See
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data &&
                    data.map((travel: Travel) => (
                      <tr
                        key={travel.id}
                        className="border-b dark:border-l-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {travel.origin}
                        </th>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {travel.destination}
                        </th>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {travel.start_date.split("T")[0]}
                        </th>
                        <td className="px-4 py-3">
                          <Link
                            to={"/home"}
                            className="p-2 cursor-pointer rounded-lg bg-gray-900 hover:bg-gray-700"
                          >
                            See
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-11">
            <form onSubmit={handleSubmit}>
              <div className="p-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <input
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Name"
                />
              </div>

              <div className="p-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Last Name
                </label>
                <input
                  value={stateLast}
                  onChange={(e) => setStateLast(e.target.value)}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Last name"
                />
              </div>

              <div className="p-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sex
                </label>
                <select
                  value={stateSex}
                  onChange={(e) => setStateSex(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" disabled hidden>
                    Select your sex
                  </option>
                  <option value="M">Male</option>
                  <option value="W">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              <div className="p-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  value={statePhone}
                  onChange={(e) => setStatePhone(e.target.value)}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="+34 123345678"
                />
              </div>

              <div className="p-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  value={stateDescription}
                  onChange={(e) => setStateDescription(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Description"
                ></textarea>
              </div>

              <div className="sm:col-span-2 p-2">
                <div className="flex items-center justify-center w-full">
                  {image === null ? (
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg 
        cursor-pointer bg-gray-40 ${
          isHovered ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                    >
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        ref={inputRef}
                        type="file"
                        id="dropzone-file"
                        multiple={true}
                        onChange={handleFileChange}
                        className="absolute w-full h-[300px] opacity-0"
                      />
                    </label>
                  ) : (
                    <div>
                      <button
                        onClick={removeImage}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="defaultModal"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                      <img
                        className="h-48 w-96"
                        src={
                          filePreview || `http://localhost:8000${user.avatar}`
                        }
                        alt="Imagen seleccionada"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex mt-4 md:mt-6">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileComponent;
