import dayjs from "dayjs";


export const getCurrentDateString = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

export const getCurrentTimeString = (): string => {
  return dayjs().format('HH:mm:ss')
}

export const getCurrentDateTimeString = (): string => {
  return dayjs().format("YYYY-MM-DD_HH:mm:ss");
}
