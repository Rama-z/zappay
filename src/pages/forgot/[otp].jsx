import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "src/Components/LayoutAuth";
import PageTitle from "src/Components/PageTitle";
import styles from "src/styles/ResetPassword.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authAction from "src/redux/actions/auth";

export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notSimiliar, setNotSimilar] = useState(false);
  const [emptyForm, setEmptyForm] = useState(true);
  const [body, setBody] = useState({});
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const toogleNewPassowrd = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const changeHandler = (e) =>
    setBody({
      ...body,
      [e.target.name]: e.target.value,
      keysChangePassword: router.query.otp,
    });

  const checkEmptyForm = (body) => {
    if (!body.newPassword || !body.confirmPassword) return setEmptyForm(true);
    body.newPassword && body.confirmPassword && setEmptyForm(false);
  };
  const resetSuccess = () => {
    toast.success("Reset Password success! Please Login again");
    router.push("/login");
  };

  const resetDenied = () => toast.error(`${auth.error}`);

  const subimitHandler = (e) => {
    e.preventDefault();
    if (body.newPassword !== body.confirmPassword) return setNotSimilar(true);
    dispatch(authAction.resetThunk(body, resetSuccess, resetDenied));
  };

  useEffect(() => {
    checkEmptyForm(body);
  }, [body]);
  useEffect(() => {
    if (auth.isLoading) setEmptyForm(true);
  }, [auth]);

  return (
    <>
      <PageTitle title="Reset Password" />

      <Layout>
        <h1 className={styles["h1"]}>
          Did You Forgot Your Password? Don’t Worry, You Can Reset Your Password
          In a Minutes.
        </h1>
        <p className={styles["description"]}>
          Now you can create a new password for your FazzPay account. Type your
          password twice so we can confirm your new passsword.
        </p>
        <form onSubmit={subimitHandler} className={styles["form"]}>
          <div className={styles["password"]}>
            <i className="bi bi-lock"></i>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter your new password"
              required
              onChange={changeHandler}
              onClick={() => setNotSimilar(false)}
            ></input>
            <i
              className={`bi ${showNewPassword ? `bi-eye-slash` : `bi-eye`} 
        ${styles["toggle-password"]}`}
              onClick={toogleNewPassowrd}
            ></i>
          </div>
          <div className={styles["password"]}>
            <i className="bi bi-lock"></i>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your password"
              required
              onChange={changeHandler}
              onClick={() => setNotSimilar(false)}
            ></input>
            <i
              className={`bi ${showConfirmPassword ? `bi-eye-slash` : `bi-eye`} 
        ${styles["toggle-password"]}`}
              onClick={toggleConfirmPassword}
            ></i>
          </div>
          <p
            className={`${styles["password-notif"]} ${
              notSimiliar ? styles["show"] : styles["hide"]
            }`}
          >
            Retyped password didn&apos;t match!
          </p>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={emptyForm}
          >
            Submit
          </button>
          <div className={styles["link-blue"]}>
            Back to{"  "}
            <Link href="/login">Login</Link>
          </div>
        </form>
      </Layout>
    </>
  );
}
