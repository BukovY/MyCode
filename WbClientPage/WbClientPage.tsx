import { WbTables, getDocumentsByUuid, updateDocument } from "api/sqlApi";
import { useAuthContext } from "context/AuthContest";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VoPayment } from "types/VoJournalTypes";
import {
  addVoOrder,
  getOrdersByClientUuid,
  getPaymentsByClientUuid,
} from "api/voJournalApi";
import { Role, getIsActionAllowed } from "context/AuthContext.utils";
import { message, Spin, Typography } from "antd";
import { FormButton } from "components/Form/Form";
import { addValueToField } from "components/Form/Form.utils";
import { FormValues } from "types/Form.types";
import {
  formConfigWbClientCompany,
  formConfigWbClientPerson,
  formConfigWbOrder,
} from "pages/WB/WbClientPage/WbClientPage.formConfig";
import { HistoryButton } from "components/History/History";
import { PlusOutlined, FileAddOutlined } from "@ant-design/icons";
import { WbCompanyView } from "pages/WB/WbClientPage/WbCompanyView/WbCompanyView";
import { WbPersonView } from "pages/WB/WbClientPage/WbPersonView/WbPersonView";
import css from "./WbClientPage.module.css";
import { WbClientOrders } from "pages/WB/WbClientPage/WBClientOrders/WbClientOrders";
import {
  WbClient,
  WbClientCompany,
  WbClientPerson,
  WbOrder,
} from "types/WbJournal.types";
import { WbClientsTabs } from "pages/WB/WbClientPage/WbClientsTabs/WbClientsTabs";
import { getSelectRequired } from "utils/formField";
import { WbInquirerVIew } from "pages/WB/WbForm/WbInquirerVIew";
import queryString from "query-string";
import { TemplatesType } from "pages/Basic/Templates/Templates";
import { getAllITemplates } from "api/templates/apiTemplates";
import { DICTIONARY_WB_FORM_TYPE } from "constants/Dictionaries.constants";

export const WbClientPage = () => {
  const params = useParams();
  const {
    globalVariable: { secret },
    isLoading,
  } = useAuthContext();

  const [client, setClient] = React.useState<WbClient | null>(null);
  const [orders, setOrders] = React.useState<WbOrder[]>([]);
  const [payments, setPayments] = React.useState<VoPayment[]>([]);
  const [templates, setTemplates] = useState<TemplatesType[]>([]);

  const { Title } = Typography;

  const reloadOrdersAndPayments = useCallback(async () => {
    if (secret !== "") {
      const client = await getDocumentsByUuid(
        WbTables.Client,
        params?.id || "",
        secret,
      );

      const orders = await getOrdersByClientUuid(params.id || "", secret, true);

      const payments = await getPaymentsByClientUuid(
        params.id || "",
        secret,
        true,
      );
      const templates = await getAllITemplates(secret);
      setTemplates(templates.filter((el) => el?.meta?.department === "WB"));

      setClient(client[0]);
      setOrders(orders);
      setPayments(payments);
    }
  }, [params.id, secret]);

  useEffect(() => {
    reloadOrdersAndPayments();
  }, [secret, params.id, reloadOrdersAndPayments]);

  if (isLoading) return <Spin size="large" />;
  if (!getIsActionAllowed([Role.wbManager])) {
    return (
      <Title level={2}>
        Вы не имеете доступ к этому контенту, обратитесь к администратору
      </Title>
    );
  }

  if (!client) return <>Загружаю клиента</>;

  return (
    <div>
      <div className={css.container}>
        <div className={css.buttons}>
          <FormButton
            config={(client.isCompany
              ? formConfigWbClientCompany
              : formConfigWbClientPerson
            ).map((item) => addValueToField(item, client))}
            onSubmit={async (values: FormValues) => {
              await updateDocument(WbTables.Client, values, secret);
              reloadOrdersAndPayments();
            }}
            title="Рекдактирование клиента"
            color="green"
          />
          <HistoryButton uuid={client?.uuid} />
          <FormButton
            config={formConfigWbOrder}
            onSubmit={async (values: FormValues) => {
              await addVoOrder(
                { ...values, clientUuid: client?.uuid },
                secret,
                true,
              );
              reloadOrdersAndPayments();
            }}
            title="Создать договор"
            icon={<PlusOutlined />}
          />
          <FormButton
            config={[
              getSelectRequired(
                "formType",
                "Тип формы",
                DICTIONARY_WB_FORM_TYPE,
              ),
              {
                name: "helperText",
                type: "textArea",
                options: {},
                label: "Хелпер",
                value: "Пожалуйста внимательно заполните форму",
              },
            ]}
            onSubmit={async (values: FormValues) => {
              const link = `${
                window.location.host
              }/wbForm/${client?.uuid}?=${queryString.stringify({
                ...values,
                clientUuid: client?.uuid,
                name: client?.name,
                phone: client?.phone,
                email: client?.email,
              })}`;

              navigator.clipboard
                .writeText(link)
                .then(() => {
                  message.success("ссылка скопирована в буфер обмена");
                })
                .catch((error) => {
                  message.error(`Чтото пошло не так! ${error}`);
                });
            }}
            title="Генерация ссылки"
            color="orange"
            icon={<FileAddOutlined />}
            children={<WbInquirerVIew />}
            customButton={{ text: "Получить ссылку для отправки туристу" }}
          />
        </div>
        {client?.isCompany ? (
          <WbCompanyView client={client as WbClientCompany} />
        ) : (
          <WbPersonView client={client as WbClientPerson} />
        )}
        <WbClientsTabs
          client={client}
          templates={templates}
          successfulCallback={reloadOrdersAndPayments}
        />
      </div>
      {orders.length ? (
        <WbClientOrders
          payments={payments}
          orders={orders}
          successfulCallback={reloadOrdersAndPayments}
          client={client}
          templates={templates}
        />
      ) : null}
    </div>
  );
};
