import { ExpandableSection } from "components/ExpandableSection/ExpandableSection";
import React from "react";
import { WbClient, WbOrder } from "types/WbJournal.types";
import { Tag, Typography } from "antd";
import { getDateFromTimeStampInDay } from "utils/date.utils";
import css from "./WbOrderItem.module.css";
import { WbOrderView } from "pages/WB/WbClientPage/WBClientOrders/WbOrderItem/WbOrderView/WbOrderView";
import { FormButton } from "components/Form/Form";
import { addValueToField } from "components/Form/Form.utils";
import { FormValues } from "types/Form.types";
import { useAuthContext } from "context/AuthContest";
import { HistoryButton } from "components/History/History";
import { addVoPayment } from "api/voJournalApi";
import { PlusOutlined } from "@ant-design/icons";
import { WbTables, updateDocument } from "api/sqlApi";
import { VoPayment } from "types/VoJournalTypes";
import { WbPaymentView } from "pages/WB/WbClientPage/WBClientOrders/WbOrderItem/WbPaymentView/WbPaymentView";
import { mapClientAndOrderToReplasments } from "pages/WB/WbClientPage/WBClientOrders/WbOrderItem/WbOrderItem.utils";
import { getColorByStatus } from "pages/VO/VoClientPage/ClientOrders/ClientOrders.utils";
import { CreateDocument } from "components/CreateDocument/CreateDocument";
import { TemplatesType } from "pages/Basic/Templates/Templates";
import { formConfigWbOrder } from "pages/WB/WbClientPage/WbClientPage.formConfig";
import { formConfigVoPayment } from "pages/VO/VoClientPage/VoClientsPage.form";
import { PayType } from "pages/VO/VoJournal/VoJournal.types";

type WbOrderItemProps = {
  order: WbOrder;
  successfulCallback: () => void;
  payments: VoPayment[];
  client: WbClient;
  templates: TemplatesType[];
};

export const WbOrderItem = ({
  order,
  successfulCallback,
  payments,
  client,
  templates,
}: WbOrderItemProps) => {
  const { globalVariable } = useAuthContext();
  const { Title, Text } = Typography;

  const updateVoOrder = async (values: FormValues) => {
    await updateDocument(WbTables.Order, values, globalVariable.secret);
    successfulCallback();
  };

  const addPayment = async (values: FormValues) => {
    await addVoPayment(values, globalVariable.secret, true);
    successfulCallback();
  };

  return (
    <ExpandableSection initialHeight={50}>
      <>
        <div className={css.heading}>
          <Title level={4} className={css.title}>
            <Text>№: {order?.contract || "нет данных"}, </Text>
            <Text className={css.hiddenInMobile}>статус: </Text>
            <Tag color={getColorByStatus(order.status)}>
              {order.status}
            </Tag>{" "}
            <Text className={css.hiddenInMobile}>дата заказа: </Text>
            <Text>{getDateFromTimeStampInDay(order.date)}</Text>
          </Title>
          <CreateDocument
            templates={templates}
            dictionary={mapClientAndOrderToReplasments(client, order)}
          />
        </div>

        <div className={css.contentContainer}>
          <div className={css.buttons}>
            <FormButton
              config={formConfigWbOrder.map((item) =>
                addValueToField(item, order),
              )}
              onSubmit={(values: FormValues) => updateVoOrder(values)}
              title="Рекдактирование заказа"
              color="green"
            />
            <FormButton
              config={formConfigVoPayment.map((item) =>
                addValueToField(item, {
                  clientUuid: order.clientUuid,
                  orderUuid: order.uuid,
                  valuta: "BYN",
                  course: 1,
                  date: Date.now(),
                  type: PayType.Nalichnye,
                }),
              )}
              onSubmit={(values: FormValues) => addPayment(values)}
              title="Добавить оплату"
              icon={<PlusOutlined />}
            />
            <HistoryButton uuid={order.uuid} />
          </div>
          <WbOrderView order={order} />
        </div>
        {payments.length ? (
          <WbPaymentView
            payment={payments}
            successfulCallback={successfulCallback}
          />
        ) : null}
      </>
    </ExpandableSection>
  );
};
