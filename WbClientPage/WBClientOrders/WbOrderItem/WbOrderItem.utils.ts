import { WbClient, WbClientPerson, WbOrder } from "types/WbJournal.types";
import { Replacements } from "components/RichTextEditor/RichTextEditor";
import { getTouristsString } from "pages/WB/WbClientPage/WbClientsTabs/WbClientsTabs.utils";
import { getDateFromTimeStampInDay } from "utils/date.utils";

export const mapClientAndOrderToReplasments = (
  client: WbClient,
  order: WbOrder,
): Replacements => {
  return {
    ...client,
    ...order,
    tourists: getTouristsString(order.tourists),
    otherActivities: order.otherActivities?.join(", "),
    birthDate: getDateFromTimeStampInDay((client as WbClientPerson)?.birthDate),
    date: getDateFromTimeStampInDay(order?.date),
    tourStartDate: getDateFromTimeStampInDay(order?.tourStartDate),
    tourEndDate: getDateFromTimeStampInDay(order?.tourEndDate),
    passportIssuedDate: getDateFromTimeStampInDay(
      (client as WbClientPerson)?.passportIssuedDate,
    ),
  } as unknown as Replacements;
};
