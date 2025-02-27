import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Input, Select, Typography, Dropdown, Row, Col, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { TYPE_OPTIONS, ETypes, isComplexTypeFn } from '../../common/constants';
import { IFormItem, ReturnFormACtions } from '../../common/constants/type';
import ValueInputByType from '../ValueInputByType';

interface IProps extends IFormItem, ReturnFormACtions {
  path: number[];
  parentType: string;
  isDeleteDisabled: boolean;
  spans?: number[];
  indent?: number;
  itemClassName?: string;
}

function FormLine({ 
  name, 
  value, 
  type, 
  path, 
  indent = 12, 
  spans = [8, 5, 8, 3], 
  parentType, 
  isDeleteDisabled, 
  itemClassName = '',
  handleAddSibling, 
  handleAddChildren, 
  handleDeleteItem, 
  handleStateChange 
}: IProps) {
  const isComplexType = useMemo(() => isComplexTypeFn(type as ETypes), [type]);
  const shouldKeyDisabled = parentType === ETypes.Array;
  const items: MenuProps['items'] = [
    {
      key: 'addSibling',
      label: (
        <Typography.Paragraph
          style={{ color: '#333', margin: 0, cursor: 'pointer' }}
          onClick={() => {
            handleAddSibling(path);
          }}
        >
          添加同级
        </Typography.Paragraph>
      ),
    },
    {
      key: 'addChildren',
      label: (
        <Typography.Paragraph
          style={{ color: '#333', margin: 0, cursor: 'pointer' }}
          onClick={() => {
            handleAddChildren(path);
          }}
        >
          添加子级
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Row className={itemClassName} style={{margin: 0, padding: '8px 0'}} align={'middle'} gutter={16}>
      <Col span={spans[0]} style={{ paddingLeft: (path.length - 1) * indent }}>
        <Input
          placeholder={shouldKeyDisabled ? '' : '请输入json的key'}
          value={name}
          onChange={(e) => {
            handleStateChange(path, 'name', e.target.value);
          }}
          disabled={shouldKeyDisabled}
        />
      </Col>
      <Col span={spans[1]}>
        <Select
          value={type}
          style={{width: '100%'}}
          options={TYPE_OPTIONS}
          onChange={(value) => {
            handleStateChange(path, 'type', value);
          }}
        />
      </Col>
      <Col span={spans[2]}>
        <ValueInputByType value={value} type={type} path={path} handleStateChange={handleStateChange} />
      </Col>
      <Col span={spans[3]}>
        {isComplexType ? (
          <Dropdown menu={{ items }}>
            <Button
              shape={'circle'}
              type={'link'}
              size={'small'}
              icon={<PlusOutlined />}
            />
          </Dropdown>
        ) : (
          <Button
            onClick={() => {
              handleAddSibling(path);
            }}
            shape={'circle'}
            type={'link'}
            size={'small'}
            icon={<PlusOutlined />}
          />
        )}

        <Button
          disabled={isDeleteDisabled}
          style={{ marginLeft: 8 }}
          onClick={() => {
            if (isDeleteDisabled) return;
            handleDeleteItem(path);
          }}
          danger
          type={'link'}
          size={'small'}
          icon={<CloseOutlined />}
        />
      </Col>
    </Row>
  );
}

export default FormLine;
