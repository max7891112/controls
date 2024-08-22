import "./App.scss";
import { Avatar } from "@mui/material";
import { TasksList } from "../App/TasksList";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getPercentage } from "../../utils/transformDataLong";
import { useEffect } from "react";
import { sendPercantage } from "../../providers/store/slices/monthSlice";
import { getOffsetWeekday } from "../../utils/dataMonthTransformation";
import { useAppDispatch, useSaveStorage } from "../../providers/store/hooks";
import {
  incrementDay,
  incrementMonth,
  incrementYear,
} from "../../providers/store/slices/currentDataSlice";
import { cancelAllTask } from "../../providers/store/slices/taskSlice";
import { sendPercantageYear } from "../../providers/store/slices/yearSlice";
import { summaryPersantageMonth } from "../../utils/dataYearTransformation";
import { NewTaskWindow } from "../NewTaskWindow/NewTaskWindow";
import { AddNewTask } from "./AddNewTask";
import { useAppSelector } from "../../providers/store/hooks";
import { NavigationArrow } from "../../ui/NavigationArrow";
import { summaryPersantageYear } from "../../utils/dataLifeTransformation";
import { sendPercantageLife } from "../../providers/store/slices/lifeSlice";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { removeUser } from "../../providers/store/slices/userSlice";

export function App() {
  const navigate = useNavigate();
  const tasks = useAppSelector((state) => state.tasks);
  const currentData = useAppSelector((state) => state.currentData);
  const month = useAppSelector((state) => state.month);
  const year = useAppSelector((state) => state.year);
  const isAddTask = useAppSelector((state) => state.isAddTask.isAddTask);
  const percantage = getPercentage(tasks) ? getPercentage(tasks) : 0;
  const dispatch = useAppDispatch();

  // send persantage to month and year

  useEffect(() => {
    dispatch(
      sendPercantage({
        index: currentData.day + getOffsetWeekday(),
        percantage: percantage,
      })
    );
    dispatch(
      sendPercantageYear({
        index: currentData.month,
        percantage: summaryPersantageMonth(month),
      })
    );
    dispatch(
      sendPercantageLife({
        index: currentData.year,
        percantage: summaryPersantageYear(year),
        birthday: 1998,
      })
    );
  }, [
    percantage,
    summaryPersantageMonth(month), // correct this
    summaryPersantageYear(year), // correct this
    currentData.day,
    currentData.month,
    currentData.year,
  ]);

  // record today and month current data in localStorage

  useEffect(() => {
    if (
      localStorage.getItem("today") !== new Date().getDate().toString() &&
      localStorage.getItem("today") !== null
    ) {
      localStorage.setItem("today", new Date().getDate().toString());
      dispatch(incrementDay());
      dispatch(cancelAllTask());
    }
    if (localStorage.getItem("today") === null) {
      localStorage.setItem("today", new Date().getDate().toString());
    }
    if (
      localStorage.getItem("month") !== new Date().getMonth().toString() &&
      localStorage.getItem("month") !== null
    ) {
      localStorage.setItem("month", new Date().getMonth().toString());
      dispatch(incrementMonth());
      dispatch(cancelAllTask());
    }
    if (localStorage.getItem("month") === null) {
      localStorage.setItem("month", new Date().getDate().toString());
    }
    if (
      localStorage.getItem("year") !== new Date().getFullYear().toString() &&
      localStorage.getItem("year") !== null
    ) {
      localStorage.setItem("year", new Date().getFullYear().toString());
      dispatch(incrementYear());
      dispatch(cancelAllTask());
    }
    if (localStorage.getItem("year") === null) {
      localStorage.setItem("year", new Date().getDate().toString());
    }
  }, []);

  useSaveStorage();

  return (
    <div className="container">
      <div className="header">
        <h1 className="header_title">Every day affairs</h1>
        <div className="header_logo-container">
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <p className="header_logo-name">Max</p>
        </div>
      </div>
      <div className="main">
        <div className="main-container">
          <h2 className="main-today">Today</h2>
          <TasksList />
          {isAddTask ? <NewTaskWindow /> : <AddNewTask />}
        </div>
      </div>
      <div className="footer">
        <CircularProgressbar
          value={percantage}
          text={`${percantage}%`}
          className="main-progressbar"
        />
        <NavigationArrow selector="today" />
      </div>
    </div>
  );
}

export default App;
