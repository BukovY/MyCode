import React, { useCallback, useEffect, useState } from "react";
import { Button, Tabs, TabsProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { WbTourClientType } from "pages/WB/WbTourClient/WbTourClient.type";
import { LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { HistoryButton } from "components/History/History";
import {
  getColumnString,
  getColumnStringFull,
  getColumnTime,
} from "utils/columnType";
import { getDocuments, getDocumentsByUuid, WbTables } from "api/sqlApi";
import { WbClient } from "types/WbJournal.types";
import { useParams } from "react-router-dom";
import { useAuthContext } from "context/AuthContest";
import { WbFormType } from "pages/WB/WbForm/WbForm.types";
import {
  getAllInquirersByClientUuid,
  updateInquirer,
} from "api/inquirer/apiInquirer";
import { addValueToField } from "components/Form/Form.utils";
import { FormValues } from "types/Form.types";
import { FormButton } from "components/Form/Form";
import {
  getFormConfigByFormType,
  mapInquireToQuickViewData,
} from "pages/WB/WbForm/WbForm.utils";
import { QuickViewButton } from "components/QuickView/QuickView";
import { tableDefaultProps } from "constants/App.constants";
import { CreateDocument } from "components/CreateDocument/CreateDocument";
import { TemplatesType } from "pages/Basic/Templates/Templates";
import { WbFormType as WbFormTypeEnum } from "types/App.types";
import { mapWbFormToReplasments } from "pages/WB/WbClientPage/WbClientsTabs/WbClientsTabs.utils";
import { formConfigWbOrder } from "pages/WB/WbClientPage/WbClientPage.formConfig";
import { addVoOrder } from "api/voJournalApi";
import { getDateFromTimeStampInDay } from "utils/date.utils";
import css from "./WbClientTabs.module.css";
import { getEmployeeNameByMail } from "utils/formField";

type WbClientsTabsProps = {
  templates: TemplatesType[];
  successfulCallback: () => void;
  client: WbClient | null;
};
export const WbClientsTabs = ({
  templates,
  successfulCallback,
  client,
}: WbClientsTabsProps) => {
  const params = useParams();
  const {
    globalVariable: { secret },
  } = useAuthContext();
  const [data, setData] = useState<{
    tour: WbTourClientType[];
    inquirers: WbFormType[];
  }>({ tour: [], inquirers: [] });

  const grtTablesData = useCallback(async () => {
    if (secret !== "") {
      const client = await getDocumentsByUuid(
        WbTables.Client,
        params?.id || "",
        secret,
      );

      const clientTours = (await getDocuments(
        WbTables.ClientTours,
        secret,
      )) as WbTourClientType[];

      const fetchedInquirers = (await getAllInquirersByClientUuid(
        secret,
        params?.id || "",
      )) as WbFormType[];
      setData({
        tour: clientTours
          .filter((el) => el.client)
          .filter((el) => el.client === client[0]?.name),
        inquirers: fetchedInquirers,
      });
    }
  }, [params?.id, secret]);

  useEffect(() => {
    grtTablesData();
  }, [secret, params.id, grtTablesData]);

  const tourColumns: ColumnsType<WbTourClientType> = [
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => {
        return (
          <div className={css.buttons}>
            <Button
              type="primary"
              shape="circle"
              href={`//${window.location.host}/wbTourClient/${record.uuid}`}
              icon={<LinkOutlined />}
              title="Перейти к расчетам"
            />
            <HistoryButton uuid={record.uuid} />
          </div>
        );
      },
    },
    getColumnStringFull("Название", "title"),
    getColumnTime("Создано", "createdAt"),
    getColumnString(
      "Создатель",
      "createdBy",
      data.inquirers,
      getEmployeeNameByMail,
    ),
    getColumnTime("Обновлено", "updatedAt"),
    getColumnString(
      "Обновил(-а)",
      "updatedBy",
      data.inquirers,
      getEmployeeNameByMail,
    ),
  ] as ColumnsType<WbTourClientType>;

  const inquirersColumns: ColumnsType<WbFormType> = [
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => {
        return (
          <div className={css.buttons}>
            <FormButton
              config={getFormConfigByFormType(WbFormTypeEnum.Complete).map(
                (item) => addValueToField(item, record as FormValues),
              )}
              onSubmit={async (values: FormValues) => {
                await updateInquirer(values, secret, params?.id || "");
                grtTablesData();
              }}
              title="Полная форма"
              color="green"
            />
            <QuickViewButton data={mapInquireToQuickViewData(record)} />
            <FormButton
              config={formConfigWbOrder.map((item) =>
                addValueToField(item, {
                  status: "В работе",
                  mealsDescription: "На маршруте",
                  transport: "Автобус туристического класса",
                  transfer: "Нет",
                  manager: "Юлия Хавронич",
                  contract: "0001",
                  totalPay: "100000 RUR",
                  eatWish: "Питание согласно программе",
                  tourType: "Сборный Виаполь",
                  ...client,
                  ...record,
                  tourists: [
                    {
                      name: record?.name,
                      passportNumber: record?.passportNumber,
                      phone: record?.phone,
                      residency: record?.registration,
                      birthDate: getDateFromTimeStampInDay(record?.birthDate),
                    },
                    ...(record?.tourists || []),
                  ],
                } as unknown as FormValues),
              )}
              onSubmit={async (values: FormValues) => {
                await addVoOrder(
                  { ...values, clientUuid: client?.uuid },
                  secret,
                  true,
                );
                successfulCallback();
              }}
              title="Создать договор"
              icon={<PlusOutlined />}
            />
            <HistoryButton uuid={record.uuid} />
          </div>
        );
      },
    },
    {
      title: "Документ",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => {
        return (
          <CreateDocument
            templates={templates}
            dictionary={mapWbFormToReplasments(record)}
          />
        );
      },
    },
    getColumnString("Тип формы", "formType"),
    getColumnTime("Создано", "createdAt"),
  ] as ColumnsType<WbFormType>;

  const items: TabsProps["items"] = [
    {
      key: "2",
      label: `Опросники (${data.inquirers.length || 0})`,
      children: (
        <Table
          {...tableDefaultProps}
          columns={inquirersColumns}
          dataSource={data.inquirers.sort(
            (a, b) => b?.createdAt - a?.createdAt,
          )}
        />
      ),
    },
    {
      key: "3",
      label: `Расчеты туров (${data.tour.length || 0})`,
      children: (
        <Table
          {...tableDefaultProps}
          columns={tourColumns}
          dataSource={data.tour.sort((a, b) => b.createdAt - a.createdAt)}
        />
      ),
    },
  ];

  return <Tabs className={css.wrapper} items={items} />;
};
