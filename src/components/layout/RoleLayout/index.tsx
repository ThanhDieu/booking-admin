/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Select, Typography } from "antd";

import clsx from "clsx";
import useView from "hooks/useView";
import { useMemo } from "react";
import { PropertyDetailAppType } from "services/Properties/type";
import { useAppSelector } from "store";
import { formatValueOption } from "utils/format";
import { SelectRoleBox } from "../AppLayout/partials";

interface RanderRoleLayout {
  [key: string]: (...props: any) => string | number | React.ReactElement | React.ReactNode | null;
}

const RanderRoleLayout: RanderRoleLayout = {
  selectViewBox: (collapsed) => {
    const { allowedViewAll } = useView()
    const { profile } = useAppSelector(store => store.orion.auth)
    return allowedViewAll ? (
      <SelectRoleBox collapsed={collapsed} />
    ) : (
      <Typography.Text title={profile?.property?.name} className={clsx(collapsed && 'hidden', 'w-[150px]')} ellipsis>
        {profile?.property?.name}
      </Typography.Text>
    )
  },
  propertyItemForm: (label) => {
    const { properties } = useAppSelector(store => store.orion.property)
    const formatProperties = useMemo(() => {
      if (!properties?.data) return [];
      const res: PropertyDetailAppType[] = properties?.data || [];
      return res && res.length
        ? res?.map((item: PropertyDetailAppType) => ({
          ...item,
          label: `${item?.name}`,
          value: formatValueOption(item, 'name', 'extId')
        }))
        : [];
    }, [properties]);

    return <Form.Item label={label} name="propertyId" rules={[{ required: true }]}>
      <Select options={formatProperties} />
    </Form.Item>
  }

};
export default RanderRoleLayout