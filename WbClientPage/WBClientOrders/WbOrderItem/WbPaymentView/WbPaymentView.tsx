import { Typography } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useAuthContext } from "context/AuthContest";
import React from "react";
import { VoPayment } from "types/VoJournalTypes";
import { getColumnString, getColumnTime } from "utils/columnType";
import { FormButton } from "components/Form/Form";
import { addValueToField } from "components/Form/Form.utils";
import { FormValues } from "types/Form.types";
import { WbTables, updateDocument } from "api/sqlApi";
import { HistoryButton } from "components/History/History";
import css from "./WbPaymentView.module.css";
import { tableDefaultProps } from "constants/App.constants";
import { formConfigVoPayment } from "pages/VO/VoClientPage/VoClientsPage.form";
import { getEmployeeNameByMail } from "utils/formField";

type WbPaymentViewProps = {
  payment: VoPayment[];
  successfulCallback: () => void;
};
export const WbPaymentView = ({
  payment,
  successfulCallback,
}: WbPaymentViewProps) => {
  const { globalVariable } = useAuthContext();
  const { Title } = Typography;

  const updateVoPayment = async (values: FormValues) => {
    await updateDocument(WbTables.Payment, values, globalVariable.secret);
    successfulCallback();
  };

  const columns: ColumnsType<VoPayment> = [
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => {
        return (
          <div className={css.buttonsContainer}>
            <FormButton
              config={formConfigVoPayment.map((item) =>
                addValueToField(item, record),
              )}
              onSubmit={async (values: FormValues) => {
                updateVoPayment(values);
              }}
              title="Редактировать оплату"
              color="green"
            />
            <HistoryButton uuid={record.uuid} />
          </div>
        );
      },
    },
    getColumnTime("Дата", "date"),
    getColumnString("Тип оплаты", "type"),
    {
      title: "Количество",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => {
        if (record.valuta !== "BYN") {
          return `${record.amount} ${record.valuta}, ${
            record.amount * record.course
          } BYN`;
        }
        return `${record.amount} BYN`;
      },
    },
    getColumnString("Валюта", "valuta"),
    getColumnString("Курс", "course"),
    getColumnString("Комментарий", "comment"),
    getColumnTime("Создано", "createdAt"),
    getColumnString("Создатель", "createdBy", payment, getEmployeeNameByMail),
    getColumnTime("Обновлено", "updatedAt"),
    getColumnString("Обновил(-а)", "updatedBy", payment, getEmployeeNameByMail),
  ] as ColumnsType<VoPayment>;

  return (
    <>
      <Title level={3}>Оплаты</Title>
      <Table {...tableDefaultProps} columns={columns} dataSource={payment} />
    </>
  );
};
