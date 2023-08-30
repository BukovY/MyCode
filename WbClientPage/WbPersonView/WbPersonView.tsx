import React from "react";
import { WbClientPerson } from "types/WbJournal.types";
import { Typography } from "antd";
import { Text } from "components/Text/Text";
import { Date } from "components/Date/Date";

type WbPersonViewType = {
  client: WbClientPerson;
};
export const WbPersonView = ({ client }: WbPersonViewType) => {
  const { Title } = Typography;

  return (
    <div>
      <Title level={2}>Информация о клиенте</Title>
      <Text title="ФИО" content={client.name} />
      <Date title="Дата рождения" content={client.birthDate} />
      <Text title="Номер паспорта" content={client.passportNumber} />
      <Text title="Органи выдавший паспорт" content={client.passportIssuedBy} />
      <Date title="Паспорт выдан" content={client.passportIssuedDate} />
      <Text title="Код отделения" content={client.departmentCode} />
      <Text title="Адрес" content={client.address} />
      <Text title="Почта" content={client.email} />
      <Text title="Телефон" content={client.phone} />
      <Text title="Комментарий" content={client.comment} />
    </div>
  );
};
