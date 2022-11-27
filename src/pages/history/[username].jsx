import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "components/Header";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import css from "styles/History.module.css";
import user1 from "src/assets/1.png";
import { useDispatch, useSelector } from "react-redux";
import userAction from "src/redux/actions/user";

function Home() {
  const isData = true;
  const [filter, setFilter] = useState(false);
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  console.log(page);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      userAction.getUserHistoryThunk(
        auth.userData.token,
        `?page=${page}&limit=5&filter=MONTH`
      )
    );
  }, [auth, page]);
  return (
    <>
      <Header title={"HOME"} />
      <Navbar />
      <section className={css.container}>
        <div className={`col-lg-3 ${css.onMobile}`}>
          <Sidebar />
        </div>
        <aside className={css["bottom-right"]}>
          <div className={css["right-top"]}>
            <p className={css["transaction"]}>Transaction History</p>
            <div className={`${css.filter} ${css.filterHead}`}>
              <div
                onClick={() => {
                  setFilter(filter ? false : true);
                }}
              >
                -- Select Filter --
              </div>
              <div className={filter ? css.filterDownOn : css.filterDownOff}>
                <p className={css.filterDownOn2}>Send</p>
                <p className={css.filterDownOn2}>Accept</p>
              </div>
            </div>
          </div>
          {isData ? (
            <div>
              {user.history &&
                user.history.map((item) => {
                  return (
                    <div className={css["card"]}>
                      <div className={css["image-name"]}>
                        <Image src={user1} alt="user" width={56} height={56} />
                        <div>
                          <p className={css["username"]}>{item.fullName}</p>
                          <p className={css.status}>{item.type}</p>
                        </div>
                      </div>
                      <div>
                        <p
                          className={
                            item.type === "accept" ? css.recieve : css.paid
                          }
                        >
                          {item.type === "accept"
                            ? `+${item.amount}`
                            : `-${item.amount}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
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
      </section>
      <Footer />
    </>
  );
}

export default Home;
