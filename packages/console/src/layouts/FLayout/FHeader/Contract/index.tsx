import * as React from 'react';
import styles from './index.less';
import {i18nMessage} from "@/utils/i18n";
import Nav from "../../components/Nav";

interface ContractProps {

}

function Contract({}: ContractProps) {
  return (<Nav onClick={() => null} active={false}>{i18nMessage('contract_manage')}</Nav>);
}

export default Contract;
