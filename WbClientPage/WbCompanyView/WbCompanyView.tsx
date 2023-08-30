import React from "react";
import { WbClientCompany } from "types/WbJournal.types";
import { Typography } from "antd";
import { RichTextViewer } from "components/RichTextViewer/RichTextViewer";
import { Text } from "components/Text/Text";

type WbCompanyViewType = {
  client: WbClientCompany;
};
export const WbCompanyView = ({ client }: WbCompanyViewType) => {
  const { Title } = Typography;

  return (
    <div>
      <Title level={2}>Информация о клиенте</Title>
      <Text title="Имя" content={client.name} />
      <Text title="Ответственное лицо" content={client.responsiblePerson} />
      <Text
        title="Должность ответственного лица"
        content={client.responsiblePersonJobTitle}
      />
      <Text
        title="Реквизиты"
        content={
          <RichTextViewer
            content={client.requisites.replaceAll("\n", "<br/>")}
          />
        }
      />
      <Text title="Адрес" content={client.address} />
      <Text title="Почта" content={client.email} />
      <Text title="Телефон" content={client.phone} />
      <Text title="Комментарий" content={client.comment} />
    </div>
  );
};
