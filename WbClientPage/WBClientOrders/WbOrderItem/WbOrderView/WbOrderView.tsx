import React from "react";
import { WbOrder } from "types/WbJournal.types";
import { Typography } from "antd";
import { Text } from "components/Text/Text";
import { Date } from "components/Date/Date";

type WbOrderViewProps = {
  order: WbOrder;
};
export const WbOrderView = ({ order }: WbOrderViewProps) => {
  const { Paragraph } = Typography;

  return (
    <div>
      <Text title="№ договора" content={order.contract} />
      <Text title="Статус" content={order.status} />
      <Text title="Менеджер" content={order.manager} />
      <Text title="Тип тура" content={order.tourType} />
      <Text title="Название" content={order.tourName} />
      <Text title="Маршрут" content={order.tourRoute} />
      <Date title="Дата старта тура" content={order.tourStartDate} />
      <Text title="Время старта тура" content={order.tourStartTime} />
      <Date title="Дата конца тура" content={order.tourEndDate} />
      <Text title="Время конца тура" content={order.tourEndTime} />
      <Text title="Место начала тура" content={order.arrivalInfo} />
      <Text title="Место конца" content={order.departureInfo} />
      <Text title="Длительность" content={order.duration} />
      <Text title="Транспорт" content={order.transport} />
      <Text
        title="Характеристика транспорта"
        content={order.transportDescription}
      />
      <Text title="Трансфер" content={order.transfer} />
      <Text title="Гостиницы" content={order.hotelInfo} />
      <Text
        title="Описание гостиниц (по законодательству РБ)"
        content={order.hotelTypeInfo}
      />
      <Text title="Тип питания" content={order.eatWish} />
      <Text
        title="Порядок обеспечения питания"
        content={order.mealsDescription}
      />
      <Text
        title="Другие активности"
        content={order.otherActivities && order.otherActivities.join(", ")}
      />
      <Text title="Размер группы" content={order.peoples} />
      <Text title="Стоимость" content={order.totalPay} />
      {order.tourists && order.tourists.length ? (
        <>
          {order.tourists.map((tourist, index) => (
            <Paragraph>
              <Text
                title={`Турист ${index + 1}`}
                content={`${tourist?.name || ""}, ${
                  tourist?.birthDate || ""
                }, ${tourist?.passportNumber || ""}, ${
                  tourist?.residency || ""
                }`}
              />
            </Paragraph>
          ))}
        </>
      ) : null}
    </div>
  );
};
