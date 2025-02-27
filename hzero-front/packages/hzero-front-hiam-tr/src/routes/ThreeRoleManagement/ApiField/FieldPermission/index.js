/**
 * 接口字段权限维护
 * /hiam/role/field/:roleId/:permissionId
 * Field
 * @author WY <yang.wang06@hand-china.com>
 * @date 2019-07-10
 * @copyright 2019-07-10 © HAND
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';

import { Content, Header } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';

import notification from 'utils/notification';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

import formatterCollections from 'hzero-front/lib/utils/intl/formatterCollections';
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import EditFormModal from './EditFormModal';

function getFieldsValueByWrappedComponentRef(ref) {
  if (ref.current) {
    const { form } = ref.current.props;
    return form.getFieldsValue();
  }
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
@formatterCollections({ code: ['hiam.roleManagement'] })
export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cachePagination: {}, // 编辑后 需要之前的分页信息
      editFormModalVisible: false, // 编辑模态框显示
      isCreate: true, // 编辑表单是否是新建
      editRecord: {}, // 编辑的记录
    };
    this.searchFormRef = React.createRef();
  }

  componentDidMount() {
    const { fieldPermissionInit } = this.props;
    fieldPermissionInit();
    this.reload();
  }

  componentWillUnmount() {
    const { updateState } = this.props;
    updateState({
      fieldPermissionDataSource: [],
      fieldPermissionPagination: {},
    });
  }

  reload() {
    const { cachePagination } = this.state;
    this.handleSearch(cachePagination);
  }

  handleSearch(pagination = {}) {
    const {
      queryFieldPermissions,
      match: {
        params: { roleId, permissionId },
      },
    } = this.props;
    this.setState({
      cachePagination: pagination,
    });
    const params = getFieldsValueByWrappedComponentRef(this.searchFormRef);
    queryFieldPermissions({
      roleId,
      permissionId,
      params: {
        ...params,
        ...pagination,
      },
    });
  }

  // Header Button
  @Bind()
  handleCreateBtnClick() {
    this.setState({
      editFormModalVisible: true,
      isCreate: true,
    });
  }

  // SearchForm
  @Bind()
  handleSearchFormSearch() {
    this.handleSearch();
  }

  // DataTable
  @Bind()
  handleDataTableChange(page, filter, sort) {
    this.handleSearch({ page, sort });
  }

  @Bind()
  handleRecordRemove(record) {
    const {
      removeFieldPermission,
      match: {
        params: { permissionId },
      },
    } = this.props;
    removeFieldPermission({
      permissionId,
      record,
    }).then((res) => {
      if (res) {
        notification.success();
        this.reload();
      }
    });
  }

  @Bind()
  handleRecordEdit(record) {
    this.setState({
      editFormModalVisible: true,
      isCreate: false,
      editRecord: record,
    });
  }

  // EditFormModal

  closeEditFormModal(callback) {
    this.setState(
      {
        editFormModalVisible: false,
        isCreate: true,
        editRecord: {},
      },
      callback
    );
  }

  @Bind()
  handleEditFormModalCancel() {
    this.closeEditFormModal();
  }

  @Bind()
  handleEditFormModalOk(data) {
    const { isCreate } = this.state;
    if (isCreate) {
      const {
        createFieldPermission,
        match: {
          params: { roleId, permissionId },
        },
      } = this.props;
      createFieldPermission({
        roleId,
        permissionId,
        record: data,
      }).then((res) => {
        if (res) {
          notification.success();
          this.closeEditFormModal(() => {
            this.reload();
          });
        }
      });
    } else {
      const {
        updateFieldPermission,
        match: {
          params: { roleId, permissionId },
        },
      } = this.props;
      const { editRecord = {} } = this.state;
      updateFieldPermission({
        roleId,
        permissionId,
        record: {
          ...editRecord,
          ...data,
        },
      }).then((res) => {
        if (res) {
          notification.success();
          this.closeEditFormModal(() => {
            this.reload();
          });
        }
      });
    }
  }

  render() {
    const {
      dataSource,
      pagination,
      fieldType,
      permissionRule,
      loading,
      saveLoading,
      removeLoading,
      organizationId,
      location: { search },
      match: {
        path,
        params: { roleId, permissionId },
      },
    } = this.props;
    const { fromSource, access_token: accessToken } = queryString.parse(search.substring(1));
    const backPath =
      // eslint-disable-next-line no-nested-ternary
      path.indexOf('/private') === 0
        ? fromSource
          ? `/private/hiam/role-tree/api/${roleId}?fromSource=${fromSource}?access_token=${accessToken}`
          : `/private/hiam/tr-role/api/${roleId}?access_token=${accessToken}`
        : fromSource
        ? `/hiam/role-tree/api/${roleId}?fromSource=${fromSource}`
        : `/hiam/tr-role/api/${roleId}`;
    const { isCreate, editFormModalVisible, editRecord } = this.state;

    return (
      <>
        <Header
          title={intl.get('hiam.roleManagement.view.title.fieldPermission').d('接口字段权限配置')}
          backPath={backPath}
        >
          <ButtonPermission
            permissionList={[
              {
                code: `${path}.button.create`,
                type: 'button',
                meaning: '接口字段权限配置-新建',
              },
            ]}
            type="primary"
            onClick={this.handleCreateBtnClick}
            icon="plus"
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </ButtonPermission>
        </Header>
        <Content>
          <SearchForm
            onSearch={this.handleSearchFormSearch}
            permissionRule={permissionRule}
            wrappedComponentRef={this.searchFormRef}
          />
          <DataTable
            path={path}
            dataSource={dataSource}
            pagination={pagination}
            onChange={this.handleDataTableChange}
            onRecordDelete={this.handleRecordRemove}
            onRecordEdit={this.handleRecordEdit}
            loading={loading}
            removeLoading={removeLoading}
          />
          <EditFormModal
            visible={editFormModalVisible}
            isCreate={isCreate}
            fieldType={fieldType}
            permissionRule={permissionRule}
            onCancel={this.handleEditFormModalCancel}
            onOk={this.handleEditFormModalOk}
            dimensionValue={roleId}
            permissionDimension="ROLE"
            permissionId={permissionId}
            organizationId={organizationId}
            record={editRecord}
            loading={saveLoading}
          />
        </Content>
      </>
    );
  }
}

function mapStateToProps({ trRoleManagement, loading }) {
  const {
    fieldPermissionDataSource,
    fieldPermissionPagination,
    fieldType,
    permissionRule,
  } = trRoleManagement;
  return {
    organizationId: getCurrentOrganizationId(),
    fieldType,
    permissionRule,
    dataSource: fieldPermissionDataSource,
    pagination: fieldPermissionPagination,
    loading:
      loading.effects['trRoleManagement/fieldPermissionInit'] ||
      loading.effects['trRoleManagement/queryFieldPermissions'],
    saveLoading:
      loading.effects['trRoleManagement/updateFieldPermission'] ||
      loading.effects['trRoleManagement/createFieldPermission'],
    removeLoading: loading.effects['trRoleManagement/removeFieldPermission'],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fieldPermissionInit(payload) {
      return dispatch({
        type: 'trRoleManagement/fieldPermissionInit',
        payload,
      });
    },
    queryFieldPermissions(payload) {
      return dispatch({
        type: 'trRoleManagement/queryFieldPermissions',
        payload,
      });
    },
    updateFieldPermission(payload) {
      return dispatch({
        type: 'trRoleManagement/updateFieldPermission',
        payload,
      });
    },
    createFieldPermission(payload) {
      return dispatch({
        type: 'trRoleManagement/createFieldPermission',
        payload,
      });
    },
    removeFieldPermission(payload) {
      return dispatch({
        type: 'trRoleManagement/removeFieldPermission',
        payload,
      });
    },
    updateState(payload) {
      return dispatch({
        type: 'trRoleManagement/updateState',
        payload,
      });
    },
  };
}
