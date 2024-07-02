import { FuncType } from 'configs/const/general';
import { PropertyDetailAppType } from 'services/Properties/type';

export default interface PropertySettingProps {}

export interface PropertyGeneralSectionProps {
  mode: FuncType;
}

export interface LocationSectionProps {
  mode: FuncType;
  propertyDetail?: PropertyDetailAppType;
}
