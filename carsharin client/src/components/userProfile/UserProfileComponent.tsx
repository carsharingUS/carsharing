import React, { ChangeEvent, useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { Travel, Token } from "../../Interfaces";
import * as jwt_decode from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { edit_user, get_solo_user } from "../../api/UserService";
import {
  getUserTravels,
  getUserTravelsAsPassenger,
} from "../../api/TravelService";
import Loader from "../Loader";
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import UserActivitySummary from "./UserActivitySummary";
import SelectTravelType from "./SelectTravelType";

const UserProfileComponent = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [stateName, setStateName] = useState<string>("");
  const [stateLast, setStateLast] = useState<string>("");
  const [stateDescription, setStateDescription] = useState<string>("");
  const [statePhone, setStatePhone] = useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [stateSex, setStateSex] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [type, setType] = useState("Host");
  const [userTravels, setUserTravels] = useState<Travel[]>([]);

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode.jwtDecode(token);

  const id = tokenDecoded.user_id;

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => get_solo_user(id),
  });

  const [selector, setSelector] = useState<string>("");

  useEffect(() => {
    if (selector === "Anfitrión") {
      const userTravels = getUserTravels();
    } else if (selector === "Pasajero") {
      const userTravelsAsPassenger = getUserTravelsAsPassenger();
    }
  }, [selector]);

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

  useEffect(() => {
    if (data) {
      setUserTravels(data);
    }
  }, [data]);

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

  const handleSelect = async (type) => {
    if (type === "host") {
      const userTravels = await getUserTravels();
      setUserTravels(userTravels);
    } else if (type === "passenger") {
      const userTravelsAsPassenger = await getUserTravelsAsPassenger();
      setUserTravels(userTravelsAsPassenger);
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

  const handleView = (travelId: number) => {
    navigate("../travels/" + travelId);
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

  return (
    <div className="flex justify-center pt-[50px]">
      <Card className="profile-card blue-background">
        <CardContent className="card-content">
          <form onSubmit={handleSubmit} className="form">
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <label htmlFor="avatar" className="avatar-label">
                {image === null ? (
                  <div className="avatar-placeholder">
                    <svg
                      aria-hidden="true"
                      className="avatar-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    ></svg>
                    <span className="avatar-text">Seleccionar imagen</span>
                  </div>
                ) : (
                  <img
                    className="avatar-preview"
                    src={filePreview || `http://localhost:8000${user.avatar}`}
                    alt="Preview"
                  />
                )}
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleFileChange}
                  className="avatar-input"
                />
              </label>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  value={stateLast}
                  onChange={(e) => setStateLast(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Sex"
                  variant="outlined"
                  value={stateSex}
                  onChange={(e) => setStateSex(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="W">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  value={statePhone}
                  onChange={(e) => setStatePhone(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={stateDescription}
                  onChange={(e) => setStateDescription(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button className="button" type="submit" variant="contained">
                  Save changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <div className="select-travel">
          <SelectTravelType onSelect={handleSelect} />
        </div>
        {userTravels.length > 0 && (
          <>
            <div className="activities-container">
              <div className="activities-summary">
                <h2>Resumen de actividades</h2>
              </div>
            </div>
            <UserActivitySummary
              userTravels={userTravels}
              handleView={handleView}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default UserProfileComponent;
