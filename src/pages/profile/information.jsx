import React, { useEffect, useState } from "react";
import Footer from "src/Components/Footer";
import Sidebar from "src/Components/Sidebar";
import css from "styles/ProfileInfo.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import userAction from "src/redux/actions/user";
import PageTitle from "src/Components/PageTitle";
import Navbar from "src/Components/Navbar";
import { toast } from "react-toastify";

function Detail() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [edit, setEdit] = useState(true);
  const profile = useSelector((state) => state.user.profile);
  const userData = useSelector((state) => state.auth.userData);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  const toEditPhone = () => {
    router.push("/profile/edit-phone");
  };

  const isEditName = () => {
    setEdit(!edit);
  };

  const changeHandler = (e) => {
    setBody({ ...body, [e.target.name]: e.target.value });
    if (e.target.value) setValue(true);
    else setValue(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const body = {
      firstName: firstName,
      lastName: lastName,
    };
    dispatch(userAction.editProfileThunk(userData.token, userData.id, body));
    toast.success("Success updating name!");
    router.push("/profile");
  };

  useEffect(() => {
    dispatch(userAction.getUserDetailThunk(userData.token, userData.id));
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
  }, [
    dispatch,
    profile.firstName,
    profile.lastName,
    userData.token,
    userData.id,
  ]);

  return (
    <>
      <PageTitle title="Profile Detail" />
      <Navbar />
      <main className={css["container"]}>
        <div className="container">
          <div className={`row ${css["main-content"]}`}>
            <div className="col-lg-3 col-md-4">
              <Sidebar />
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div className={css["profile-info"]}>
                <div className={css["title"]}>
                  <h1>Personal Information</h1>
                </div>
                <div className={css["definition"]}>
                  <p>
                    We got your personal information from the sign up proccess.
                    If you want to make changes on your information, contact our
                    support.
                  </p>
                </div>
                <div
                  className={css["edit-btn"]}
                  onClick={(e) => {
                    e.preventDefault();
                    isEditName();
                  }}
                >
                  <p>Edit</p>
                </div>
                <form action="" onSubmit={submitHandler}>
                  <div className={css["input-bar"]}>
                    <label htmlFor="">First Name</label>
                    <input
                      className={css["name"]}
                      type="text"
                      name="firstName"
                      value={firstName === null ? "Input Here..." : firstName}
                      disabled={edit}
                      placeholder="Input Here..."
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                  </div>
                  <div className={css["input-bar"]}>
                    <label htmlFor="">Last Name</label>
                    <input
                      className={css["name"]}
                      type="text"
                      name="lastName"
                      disabled={edit}
                      value={lastName === null ? "Input Here..." : lastName}
                      placeholder="Input Here..."
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                  </div>
                  <div className={css["input-bar"]}>
                    <label htmlFor="">Verified E-mail</label>
                    <input
                      type="text"
                      value={profile.email}
                      placeholder="Input Here..."
                    />
                  </div>
                  <div className={`${css["input-bar"]} ${css["input-phone"]}`}>
                    <div className={css["left"]}>
                      <label htmlFor="">Phone Number</label>
                      <input
                        type="text"
                        value={
                          !profile.noTelp
                            ? "+62-xx-xxxx-xxxx"
                            : `+62${profile.noTelp}`
                        }
                        placeholder="Input Here..."
                      />
                    </div>
                    <div className={css["right"]}>
                      <p onClick={toEditPhone}>Manage</p>
                    </div>
                  </div>
                  {!edit && (
                    <div className={css["save-btn"]}>
                      <button type="submit">Save Change</button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Detail;
