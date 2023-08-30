import {
  getDateField,
  getHiddenField,
  getPriceFieldRequired,
  getSelectRequired,
  getStringField,
} from "utils/formField";
import { FormFieldType } from "types/Form.types";
import { objectMetadata } from "constants/Form.constants";
import {
  DICTIONARY_EMPLOYEE,
  DICTIONARY_WB_START_TOUR_TIME,
  DICTIONARY_WB_TOUR_STATUS,
  DICTIONARY_WB_TOUR_TYPE,
  DICTIONARY_WB_TRANSPORT_TYPE,
} from "constants/Dictionaries.constants";

export const formConfigWbClientPerson = [
  getHiddenField("uuid"),
  getStringField("name", "ФИО"),
  getDateField("birthDate", "Дата рождения"),
  getStringField("passportNumber", "Номер паспорта"),
  getStringField("passportIssuedBy", "Орган, выдавший паспорт"),
  getDateField("passportIssuedDate", "Дата выдачи паспорта"),
  getStringField("departmentCode", "Код подразделения"),
  getStringField("address", "Адрес"),
  getStringField("email", "Почта"),
  getStringField("phone", "Телефон"),
  {
    name: "isCompany",
    type: "boolean",
    options: {
      displayOnFront: false,
    },
    label: "isCompany",
    value: false,
  },
  {
    name: "comment",
    type: "textArea",
    options: {},
    label: "Комментарий",
  },
  ...objectMetadata,
] as FormFieldType[];

export const formConfigWbClientCompany = [
  getHiddenField("uuid"),
  getStringField("name", "Название компании"),
  getStringField("responsiblePerson", "Представитель ФИО"),
  getStringField("responsiblePersonJobTitle", "Должность представителя"),

  {
    name: "requisites",
    type: "textArea",
    options: {},
    label: "Реквизиты",
    value: "Вставь сюда реквизиты",
  },
  getStringField("address", "Адрес"),
  getStringField("email", "Почта"),
  getStringField("phone", "Телефон"),
  {
    name: "isCompany",
    type: "boolean",
    options: {
      displayOnFront: false,
    },
    label: "isCompany",
    value: true,
  },
  {
    name: "comment",
    type: "textArea",
    options: {},
    label: "Комментарий",
  },
  ...objectMetadata,
] as FormFieldType[];

export const formConfigWbOrder = [
  getHiddenField("uuid"),
  getHiddenField("clientUuid"),
  getDateField("date", "Дата заказа"),
  getSelectRequired("tourType", "Тип тура", DICTIONARY_WB_TOUR_TYPE),
  getStringField("tourName", "Название тура"),
  getStringField("tourRoute", "Маршрут тура"),
  getDateField("tourStartDate", "Дата старта тура"),
  getSelectRequired(
    "tourStartTime",
    "Время старта тура",
    DICTIONARY_WB_START_TOUR_TIME,
  ),
  getDateField("tourEndDate", "Дата конца тура"),
  getSelectRequired(
    "tourEndTime",
    "Время конца тура",
    DICTIONARY_WB_START_TOUR_TIME,
  ),
  getStringField("duration", "Длительность (дни или часы)"),
  getStringField("arrivalInfo", "Место, где начинается тур"),
  getStringField("departureInfo", "Место, где заканчивается тур"),
  getSelectRequired(
    "transport",
    "Тип транспорта",
    DICTIONARY_WB_TRANSPORT_TYPE,
  ),
  getStringField("transportDescription", "Описание транспорта"),
  getStringField("transfer", "Услуги трансфера"),
  getStringField("hotelInfo", "Услуги по размещению"),

  getStringField("hotelTypeInfo", "Характеристика размещения"),
  getStringField("eatWish", "Типы предоставляемого питания"),
  getStringField("mealsDescription", "Порядок обеспечения питания"),
  getPriceFieldRequired("peoples", "Размер группы"),

  getStringField("totalPay", "Полная стоимость"),
  getStringField("contract", "Номер договора"),
  getSelectRequired("status", "Статус", DICTIONARY_WB_TOUR_STATUS, "В работе"),
  getSelectRequired("manager", "Менеджер", DICTIONARY_EMPLOYEE),
  {
    name: "otherActivities",
    type: "arrayString",
    options: {},
    label: "Другие активности",
  },
  {
    name: "tourists",
    type: "wbTourists",
    options: {},
    label: "Туристы",
  },
  ...objectMetadata,
] as FormFieldType[];
