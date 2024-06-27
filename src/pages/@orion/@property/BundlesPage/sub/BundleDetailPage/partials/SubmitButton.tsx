import { Button, Form, FormInstance, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SubmitButtonProps {
  form: FormInstance;
}

export default function SubmitButton({ form }: SubmitButtonProps) {
  const { t } = useTranslation(['common'])
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    ).catch(() => null);
  }, [values]);

  const handleConfirm = () => {
    form.submit();
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 1000);
    });
  };

  return (
    // <Popconfirm
    //   title={t('common:modal.confirmation')}
    //   description={t('common:modal.double_check_bundle')}
    //   placement="bottomLeft"
    //   overlayClassName="w-[350px]"
    //   disabled={!submittable}
    //   onConfirm={handleConfirm}
    //   destroyTooltipOnHide
    // >
    <Button
      type="primary"
      onClick={() => form.submit()}
    // disabled={!submittable}
    >
      {t('common:button.save')}
    </Button>
    // </Popconfirm>
  );
}
