import moment from "moment";

export function formatDateTimeAndOrderId(date: Date, orderId: number): string {
  const formattedDate = moment(date).format("YYMMDD");
  return `${formattedDate}_${orderId}`;
}
