import { WbFormType, WbServicesType } from "pages/WB/WbForm/WbForm.types";
import { Replacements } from "components/RichTextEditor/RichTextEditor";
import { WbTourists } from "types/WbJournal.types";
import { getDateFromTimeStampInDay } from "utils/date.utils";

export const getTouristsString = (tourists?: WbTourists[]): string => {
  if (!tourists) return "";
  return (
    tourists
      .map(
        (
          { name = "", phone = "", passportNumber = "", residency = "" },
          index,
        ) => `${index + 2}) ${name} ${passportNumber} ${phone} ${residency}`,
      )
      .join("<br/> ") || ""
  );
};

export const getStringFormServices = (services?: WbServicesType[]) => {
  if (!services) return "";
  return (
    services
      .map(({ title = "", date = "" }) => `${title} ${date}`)
      .join("<br/> ") || ""
  );
};

export const mapWbFormToReplasments = (form: WbFormType): Replacements => {
  const tourists = `1) ${form.name} ${form.passportNumber} ${form.phone} ${
    form.registration
  } <br/> ${getTouristsString(form.tourists)}`;
  const services = getStringFormServices(form.services);
  return {
    ...form,
    tourists,
    services,
    birthDate: getDateFromTimeStampInDay(form?.birthDate),
    passportIssuedDate: getDateFromTimeStampInDay(form?.birthDate),
    date: getDateFromTimeStampInDay(form?.createdAt),
  };
};
