import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import UserCard from "./UserCard";

import { BASE_URL } from "../utils/const";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [loading, setLoading] = useState(false);

  // SAVE PROFILE
  const saveProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(addUser(res?.data?.data));

      toast.success("Profile updated successfully 🎉", {
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data || "Failed to update profile", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-10 my-10 px-5">
      <div className="card bg-base-300 w-full max-w-md shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl font-bold mb-4">
            Edit Profile
          </h2>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">First Name</span>
            </div>
            <input
              type="text"
              value={firstName}
              className="input input-bordered w-full"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">Last Name</span>
            </div>
            <input
              type="text"
              value={lastName}
              className="input input-bordered w-full"
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">Photo URL</span>
            </div>
            <input
              type="text"
              value={photoURL}
              className="input input-bordered w-full"
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </label>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">Age</span>
            </div>
            <input
              type="number"
              value={age}
              className="input input-bordered w-full"
              onChange={(e) => setAge(e.target.value)}
            />
          </label>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">Gender</span>
            </div>
            <select
              value={gender}
              className="select select-bordered w-full"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </label>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">About</span>
            </div>
            <textarea
              value={about}
              className="textarea textarea-bordered w-full h-28"
              placeholder="Write something about yourself..."
              onChange={(e) => setAbout(e.target.value)}
            />
          </label>
          <div className="card-actions justify-center mt-5">
            <button
              className="btn btn-primary w-full"
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
      <UserCard
        user={{
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
        }}
      />
    </div>
  );
};

export default EditProfile;
