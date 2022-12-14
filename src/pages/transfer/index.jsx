import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Header from "src/Components/Header";
import Navbar from "src/Components/Navbar";
import Sidebar from "src/Components/Sidebar";
import Footer from "src/Components/Footer";
import css from "styles/Transfer.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import userAction from "src/redux/actions/user";
import icon from "src/assets/search.png";
import sample from "src/assets/avatar.webp";
import { getAllUser } from "src/modules/api/User";
import transferDataActions from "src/redux/actions/transfer";

// const ReactCodeInput = dynamic(import("react-code-input"));

export default function Home({ Fragment }) {
  const router = useRouter();
  const [filter, setFilter] = useState(false);
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const token = auth.userData.token;
  const link = process.env.NEXT_PUBLIC_CLOUDINARY_LINK;
  const [page, setPage] = useState(1);
  const [searchs, setSearchs] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      userAction.getAllUserThunk(
        auth.userData.token,
        `?page=${page}&limit=5&search=${router.query.querys}`
      )
    );
  }, [auth, page, router.query, dispatch]);

  useEffect(() => {
    router.query.querys
      ? getAllUser(token, page, router.query.querys)
          .then((res) => {
            setUserData(res.data.data);
            setPaginationData(res.data.pagination);
          })
          .catch((err) => console.log(err))
      : getAllUser(token, page)
          .then((res) => {
            setUserData(res.data.data);
            setPaginationData(res.data.pagination);
          })
          .catch((err) => console.log(err));
    dispatch(transferDataActions.transferReset());
  }, [router.query, dispatch, page, token]);

  return (
    <>
      <Header title={"HOME"} />
      <Navbar />
      <div className={css.container}>
        <div className={`col-lg-3 ${css.onMobile}`}>
          <Sidebar />
        </div>
        <aside className={`${css["bottom-right"]} ${css.side}`}>
          <div className={css["right-top"]}>
            <p className={css["transaction"]}>Search Receiver</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/transfer?querys=${e.target.querys.value}`);
            }}
          >
            <div className={css.searchs}>
              <Image src={icon} className={css.searchImage} alt="search" />
              <input
                type="text"
                className={css.searchInput}
                name="querys"
                defaultValue={router.query.querys || null}
                placeholder="Search receiver here"
              />
            </div>
          </form>
          {user.allData ? (
            user.allData.map((item, idx) => {
              return (
                <div className={css.conimage} key={idx}>
                  <div
                    className={css["card"]}
                    onClick={() => {
                      router.push(`/transfer/ammount/${item.id}`);
                    }}
                  >
                    <div className={css["image-name"]}>
                      <div className={css["image-profile"]}>
                        <Image
                          src={item.image ? `${link}/${item.image}` : sample}
                          alt="user"
                          width={56}
                          height={56}
                          key={idx}
                        />
                      </div>
                      <div>
                        <p
                          className={css["username"]}
                        >{`${item.firstName} ${item.lastName}`}</p>
                        <p className={css.status}>
                          {item.noTelp ? item.noTelp : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>
              <div className={css["no-data"]}>No Data Available</div>
            </div>
          )}
          <div className={`${css["paginasi"]}`}>
            <button
              type="submit"
              className={`${css["previous-button"]} btn ${
                user.pagination.page === 1 ? `btn-secondary` : `btn-primary`
              } `}
              disabled={user.pagination.page === 1}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              Previous
            </button>
            <button
              type="submit"
              className={`${css["next-button"]} btn ${
                user.pagination.page === user.pagination.totalPage
                  ? `btn-secondary`
                  : `btn-primary`
              } `}
              disabled={user.pagination.page === user.pagination.totalPage}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Next
            </button>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}
