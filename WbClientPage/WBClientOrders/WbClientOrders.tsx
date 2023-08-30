import React from "react";
import { WbClient, WbOrder } from "types/WbJournal.types";
import { WbOrderItem } from "pages/WB/WbClientPage/WBClientOrders/WbOrderItem/WbOrderItem";
import { Typography } from "antd";
import { VoPayment } from "types/VoJournalTypes";
import { TemplatesType } from "pages/Basic/Templates/Templates";

type WbClientOrdersProps = {
  orders: WbOrder[];
  successfulCallback: () => void;
  payments: VoPayment[];
  client: WbClient;
  templates: TemplatesType[];
};

export const WbClientOrders = ({
  orders,
  successfulCallback,
  payments,
  client,
  templates,
}: WbClientOrdersProps) => {
  const { Title } = Typography;
  return (
    <>
      <Title level={2}>Договора</Title>
      {orders.map((order) => {
        const paymentsToView = payments.filter(
          (pay) => pay.orderUuid === order.uuid,
        );
        return (
          <WbOrderItem
            order={order}
            successfulCallback={successfulCallback}
            payments={paymentsToView}
            client={client}
            templates={templates}
          />
        );
      })}
    </>
  );
};
