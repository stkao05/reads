import { OpeningPeriod, getStoreStatus } from "../opening-hours";

describe("getStoreStatus", () => {
  const ex1: OpeningPeriod[] = [
    { open: { day: 0, time: "0900" }, close: { day: 0, time: "2000" } },
    { open: { day: 1, time: "0900" }, close: { day: 1, time: "2000" } },
    { open: { day: 2, time: "0900" }, close: { day: 2, time: "2000" } },
    { open: { day: 3, time: "0900" }, close: { day: 3, time: "2000" } },
    { open: { day: 4, time: "0900" }, close: { day: 4, time: "2000" } },
    { open: { day: 5, time: "0900" }, close: { day: 5, time: "2000" } },
    { open: { day: 6, time: "0900" }, close: { day: 6, time: "2000" } },
  ];

  test("before open hours", () => {
    let now = new Date("2023-12-05T00:00:00"); // midnight tuesday
    const status = getStoreStatus(ex1, now);
    expect(status).toEqual({
      open: false,
      next: { open: { day: 2, time: "0900" }, close: { day: 2, time: "2000" } },
    });
  });

  test("in the open hours", () => {
    let now = new Date("2023-12-05T10:00:00");
    let status = getStoreStatus(ex1, now);
    expect(status).toEqual({
      open: true,
      current: {
        open: { day: 2, time: "0900" },
        close: { day: 2, time: "2000" },
      },
    });

    now = new Date("2023-12-05T09:00:00");
    status = getStoreStatus(ex1, now);
    expect(status).toEqual({
      open: true,
      current: {
        open: { day: 2, time: "0900" },
        close: { day: 2, time: "2000" },
      },
    });

    now = new Date("2023-12-05T20:00:00");
    status = getStoreStatus(ex1, now);
    expect(status).toEqual({
      open: true,
      current: {
        open: { day: 2, time: "0900" },
        close: { day: 2, time: "2000" },
      },
    });
  });

  test.skip("after close hour", () => {
    let now = new Date("2023-12-05T22:00:00");
    const status = getStoreStatus(ex1, now);
    expect(status).toEqual({
      open: false,
      next: { open: { day: 3, time: "0900" }, close: { day: 3, time: "2000" } },
    });
  });

  const ex2 = [
    { open: { day: 1, time: "1100" }, close: { day: 1, time: "2200" } },
    { open: { day: 2, time: "1100" }, close: { day: 2, time: "2200" } },
    { open: { day: 3, time: "1100" }, close: { day: 3, time: "2200" } },
    { open: { day: 4, time: "1100" }, close: { day: 4, time: "2200" } },
    { open: { day: 5, time: "0000" }, close: { day: 1, time: "0000" } },
  ];
});
