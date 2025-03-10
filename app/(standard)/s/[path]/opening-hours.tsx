import { PlaceDetail } from "@/app/admin/store/[id]/google-complete";

export function OpeningHours(props: { place: PlaceDetail }) {
  if (!props.place.opening_hours) return null;

  const day = (new Date().getDay() + 6) % 7;

  let todayHours = props.place.opening_hours.weekday_text[day];
  const regex = /^(\S+):/gm;
  todayHours = todayHours.replace(regex, "今日：");

  return (
    <>
      <div>營業時間</div>
      <details className="details-reset ">
        <summary className="hover:bg-zinc-100 rounded cursor-pointer">
          {todayHours}
          {/* <TodayStatus place={props.place} /> */}
        </summary>
        <HoursDetail weekdayText={props.place.opening_hours.weekday_text} />
      </details>
    </>
  );
}

/**
 * TODO: getStoreStatus() has bug
 */
function TodayStatus(props: { place: PlaceDetail }) {
  if (!props.place.opening_hours) return null;

  const periods = props.place.opening_hours.periods;
  const status = getStoreStatus(periods);

  let summary = null;
  if (status.open) {
    const time = status.current.close.time as string;
    summary = (
      <>
        <span className="text-green-600">營業中</span>。今日營業至：{" "}
        {formatTime(time)}
      </>
    );
  } else {
    const time = status.next.open.time;
    const day = daytxt[status.next.open.day];
    summary = (
      <>
        <span className="text-red-600">休息中</span>。開始營運時間：{day}
        {formatTime(time)}
      </>
    );
  }

  return summary;
}

function HoursDetail(props: { weekdayText: string[] }) {
  const today = new Date().getDay();
  return (
    <div>
      {props.weekdayText.map((x, i) => {
        const day = (i + 1) % 7;

        // replace ":" with "："
        const regex = /^(\S+):/gm;
        const txt = x.replace(regex, "$1：");

        return (
          <div key={x} className={` ${day == today ? "font-medium" : ""}`}>
            {txt}
          </div>
        );
      })}
    </div>
  );
}

export type OpeningPeriod = {
  close: {
    day: number;
    time: string; // in 24h format. i.e. "2000"
  };
  open: {
    day: number;
    time: string;
  };
};

const daytxt = {
  0: "星期日",
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
} as { [day: number]: string };

function formatTime(time: string) {
  if (time.length !== 4) throw new Error("invalid time format");

  return `${time.slice(0, 2)}:${time.slice(2)}`;
}

/**
 * @param periods
 * @returns
 *  - open: open is current open or not
 *  - current: if store is open, the current OpeningPeriod
 *  - next: if store is close, the next OpeningPeriod
 */
export function getStoreStatus(
  periods: OpeningPeriod[],
  now?: Date
):
  | { open: true; current: OpeningPeriod }
  | { open: false; next: OpeningPeriod } {
  if (!now) now = new Date();

  const curDay = now.getDay();
  const curTime = timestr(now);

  for (const p of periods) {
    if (withinPeriod(p, curDay, curTime)) {
      return { open: true, current: p };
    }
  }

  for (let i = 0; i <= 6; i++) {
    let day = (curDay + i) % 7 || 7;

    const p = periods.find((p) => withinDay(p, day));
    if (p) {
      return { open: false, next: p };
    }
  }

  throw new Error("assertion fail: there should be at least one open period");
}

function withinDay(period: OpeningPeriod, day: number) {
  let within = false;
  let d = period.open.day;
  const closePlusOne = period.close.day + (1 % 7) || 7; // one day past the close day

  while (d != closePlusOne) {
    if (d === day) {
      within = true;
    }
    d = (d + 1) % 7 || 7;
  }

  return within;
}

function withinPeriod(period: OpeningPeriod, day: number, time: string) {
  const inDay = withinDay(period, day);
  if (!inDay) return false;

  if (period.open.day === day && period.close.day === day) {
    return period.open.time <= time && time <= period.close.time;
  }

  if (period.close.day === day) {
    return time <= period.close.time;
  }

  return true;
}

/**
 * @returns current time in 24h format (hhmm)
 */
function timestr(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}${minutes}`;
}
