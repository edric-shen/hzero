/**
 * RoleManagement - 三员角色管理
 * @date: 2020-7-16
 * @author: Nemo <yingbin.jiang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { Spin, Form } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { isArray, isEmpty, isFunction, isNumber, isObject, isString } from 'lodash';
import { Bind } from 'lodash-decorators';

import { Content, Header } from 'components/Page';
import { deleteCache } from 'components/CacheComponent';
import { Button as ButtonPermission } from 'components/Permission';
// import Lov from 'components/Lov';
import uuidv4 from 'uuid/v4';

import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  createPagination,
  getCurrentOrganizationId,
  isTenantRoleLevel,
  addItemToPagination,
  delItemToPagination,
  // getCurrentUser,
} from 'utils/utils';

import AssignMember from './AssignMember';
// import AssignSecGrpDrawer from './AssignSecGrp';
import ClientsDrawer from './Clients';
import Search from './Search';
import List from './List';
import AuthDrawer from './Auth';
import DetailDrawer from './Detail';
import PermissionDrawer from './Permissions';
import RoleAssignCardsEditModal from './Cards';

import styles from './index.less';

function isJSON(str) {
  let result;
  try {
    result = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return isObject(result) && !isString(result);
}

// const formLayout = {
//   labelCol: { span: 10 },
//   wrapperCol: { span: 14 },
// };

/**
 * index - 角色管理
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {!Object} roleManagement - 数据源
 * @reactProps {!Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(
  ({
    loading = {},
    trRoleManagement,
    trRoleDataAuthorityCompany,
    trRoleDataAuthorityPurorg,
    trRoleDataAuthorityManagement,
    trRoleDataAuthorityPuragent,
    trRoleDataAuthorityLovView,
    trRoleDataAuthorityDataSource,
    trRoleDataAuthorityValueList,
    trRoleDataAuthorityDataGroup,
  }) => ({
    trRoleManagement,
    trRoleDataAuthorityCompany,
    trRoleDataAuthorityPurorg,
    trRoleDataAuthorityManagement,
    trRoleDataAuthorityPuragent,
    trRoleDataAuthorityLovView,
    trRoleDataAuthorityDataSource,
    trRoleDataAuthorityValueList,
    trRoleDataAuthorityDataGroup,
    queryListLoading: loading.effects['trRoleManagement/queryList'],
    saveMembersLoading: loading.effects['trRoleManagement/saveMembers'],
    deleteMembersLoading: loading.effects['trRoleManagement/deleteMembers'],
    queryMemberRolesUsersLoading: loading.effects['trRoleManagement/queryMemberRolesUsers'],
    queryDetailFormLoading: loading.effects['trRoleManagement/queryDetailForm'],
    queryAdminRoleLoading: loading.effects['trRoleManagement/queryAdminRole'],
    saveRoleLoading: loading.effects['trRoleManagement/saveRole'],
    queryMemberRolesClientsLoading: loading.effects['trRoleManagement/queryMemberRolesClients'],
    createRoleLoading: loading.effects['trRoleManagement/createRole'],
    copyRoleLoading: loading.effects['trRoleManagement/copyRole'],
    inheritRoleLoading: loading.effects['trRoleManagement/inheritRole'],
    queryPermissionMenusLoading: loading.effects['trRoleManagement/queryPermissionMenus'],
    batchAssignPermissionSetsLoading: loading.effects['trRoleManagement/batchAssignPermissionSets'],
    batchUnassignPermissionSetsLoading:
      loading.effects['trRoleManagement/batchUnassignPermissionSets'],
    fetchRoleCardsLoading: loading.effects['trRoleManagement/fetchRoleCards'],
    removeRoleCardsLoading: loading.effects['trRoleManagement/removeRoleCards'],
    saveRoleCardsLoading: loading.effects['trRoleManagement/saveRoleCards'],
    tenantRoleLevel: isTenantRoleLevel(),
    roleAuthLoading: loading.effects['trRoleManagement/queryRoleAuth'],
    saveAuthLoading: loading.effects['trRoleManagement/saveRoleAuth'],
    fetchTabListLoading: loading.effects['trRoleDataAuthorityManagement/fetchTabList'],
    updateCompanyLoading: loading.effects['trRoleDataAuthorityCompany/updateAuthorityCompany'],
    fetchCompanyLoading:
      loading.effects['trRoleDataAuthorityCompany/fetchAuthorityCompanyAndExpand'],
    refreshCompanyLoading: loading.effects['trRoleDataAuthorityCompany/fetchAuthorityCompany'],
    addPurOrgLoading: loading.effects['trRoleDataAuthorityPurorg/addAuthorityPurorg'],
    fetchPurOrgLoading: loading.effects['trRoleDataAuthorityPurorg/fetchAuthorityPurorg'],
    fetchModalPurOrgLoading: loading.effects['trRoleDataAuthorityPurorg/fetchModalData'],
    addPuragentLoading: loading.effects['trRoleDataAuthorityPuragent/addAuthorityPuragent'],
    fetchPuragentLoading: loading.effects['trRoleDataAuthorityPuragent/fetchAuthorityPuragent'],
    fetchModalPuragentLoading: loading.effects['trRoleDataAuthorityPuragent/fetchModalData'],
    addValueListLoading: loading.effects['trRoleDataAuthorityValueList/addAuthorityValueList'],
    fetchValueListLoading: loading.effects['trRoleDataAuthorityValueList/fetchAuthorityValueList'],
    fetchModalValueListLoading: loading.effects['trRoleDataAuthorityValueList/fetchModalData'],
    addLovViewLoading: loading.effects['trRoleDataAuthorityLovView/addAuthorityLovView'],
    fetchLovViewLoading: loading.effects['trRoleDataAuthorityLovView/fetchAuthorityLovView'],
    fetchModalLovViewLoading: loading.effects['trRoleDataAuthorityLovView/fetchModalData'],
    addDataSourceLoading: loading.effects['trRoleDataAuthorityDataSource/addAuthorityDataSource'],
    fetchDataSourceLoading:
      loading.effects['trRoleDataAuthorityDataSource/fetchAuthorityDataSource'],
    fetchModalDataSourceLoading: loading.effects['trRoleDataAuthorityDataSource/fetchModalData'],
    addDataGroupLoading: loading.effects['trRoleDataAuthorityDataGroup/addAuthorityDataGroup'],
    fetchDataGroupLoading: loading.effects['trRoleDataAuthorityDataGroup/fetchAuthorityDataGroup'],
    fetchModalDataGroupLoading: loading.effects['trRoleDataAuthorityDataGroup/fetchModalData'],
    queryRoleCardLoading: loading.effects['trRoleManagement/queryRoleCard'],
    // querySecGrpLoading: loading.effects['trRoleManagement/querySecurityGroup'],
    // queryAssignableSecGrpLoading: loading.effects['trRoleManagement/fetchAssignableSecGrp'],
    assignSecGrpLoading: loading.effects['trRoleManagement/assignSecGrp'],
    deleteSecGrpLoading: loading.effects['trRoleManagement/deleteSecGrp'],
    queryVisitPermissionLoading: loading.effects['trRoleManagement/querySecGrpPermissionMenus'],
    shieldLoading:
      loading.effects['trRoleManagement/shieldSecGrpPermission'] ||
      loading.effects['trRoleManagement/cancelShieldSecGrpPermission'],
    queryFieldPermissionLoading: loading.effects['trRoleManagement/queryFieldPermission'],
    queryFieldConfigLoading: loading.effects['trRoleManagement/queryFieldConfig'],
    queryCardLoading: loading.effects['trRoleManagement/queryCardPermission'],
    queryDataDimensionLoading: loading.effects['trRoleManagement/queryDataDimension'],
    queryDataPermissionTabLoading: loading.effects['trRoleManagement/queryDataPermissionTab'],
  })
)
@Form.create()
@formatterCollections({ code: ['hiam.roleManagement', 'hiam.authority', 'hiam.securityGroup'] })
export default class ThreeRoleManagement extends React.Component {
  constructor(props) {
    super(props);
    this.fetchList = this.fetchList.bind(this);
    this.fetchRoleSourceCode = this.fetchRoleSourceCode.bind(this);
    this.fetchAssignLevelCode = this.fetchAssignLevelCode.bind(this);
    this.fetchMemberRolesUsers = this.fetchMemberRolesUsers.bind(this);
    this.fetchCurrentRole = this.fetchCurrentRole.bind(this);
    this.redirectCreate = this.redirectCreate.bind(this);
    this.setClientsDrawerVisible = this.setClientsDrawerVisible.bind(this);
    this.openMembersDrawer = this.openMembersDrawer.bind(this);
    this.openClientsDrawer = this.openClientsDrawer.bind(this);
    this.openPermissions = this.openPermissions.bind(this);
  }

  state = {
    membersDrawerVisible: false,
    clientsDrawerVisible: false,
    secGrpDrawerVisible: false, // 是否显示分配安全组弹窗
    membersDrawerDataSource: [],
    membersDrawerPagination: {},
    currentRowData: {},
    selectedRoleId: null,
    actionType: null,
    detailDrawerVisible: false,
    permissionDrawerVisible: false,
    currentRole: {},
    expandedRowKeys: [],
    roleAssignCardsEditModalProps: {
      visible: false,
      role: {}, // 编辑的角色
    },
    tenantsLoaded: false, // 表明已经加载了当前用户的租户
    tenantsMulti: false, // 表明是否是 多租户
    tenantId: 0,
    record: {},
  };

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const { trRoleManagement = {}, dispatch } = this.props;
    const { code } = trRoleManagement;

    const isTenant = isTenantRoleLevel();
    if (isTenant) {
      // 查询当前账号的所有租户
      this.fetchCurrentTenants();
    }

    // this.fetchAssignLevelCode();

    /**
     * 初始化角色层级列表值集
     */
    dispatch({
      type: 'trRoleManagement/init',
    });

    this.fetchSearchLabels();
    this.fetchCurrentRole();
    // if (isEmpty(list.dataSource) || (location.state || {}).refresh) {
    //   this.fetchList();
    // }
    this.fetchList();

    if (isEmpty(code['HIAM.ROLE_SOURCE'])) {
      this.fetchRoleSourceCode();
    }
  }

  // #region fetch data

  fetchCurrentTenants() {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/fetchCurrentTenants',
    }).then((res) => {
      if (res) {
        const nextPartialState = {};
        nextPartialState.tenantsLoaded = true;
        if (res.length > 1) {
          nextPartialState.tenantsMulti = true;
        } else if (res.length === 1) {
          nextPartialState.tenantsMulti = res[0].tenantId !== getCurrentOrganizationId();
        }
        this.setState(nextPartialState);
      }
    });
  }

  /**
   * fetchList - 查询列表数据
   * @param {object} [params = {}] - 查询参数
   * @param {string} params.name - 目录/菜单名
   * @param {string} params.parentName - 上级目录
   */
  fetchList(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/queryList',
      params: { ...params },
    }).then(() => {
      const { trRoleManagement } = this.props;
      const { list } = trRoleManagement;
      const { name, tenantId, roleSource } = params || {};
      if (!isEmpty(name) || !isEmpty(roleSource) || isNumber(tenantId)) {
        this.setState({
          expandedRowKeys: list.rowKeys || [],
        });
      }
    });
  }

  /**
   * fetchRoleSourceCode - 查询角色来源值集
   */
  fetchRoleSourceCode() {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/queryCode',
      payload: { lovCode: 'HIAM.ROLE_SOURCE' },
    });
  }

  /**
   * 查询搜索字段 标签 数据
   */
  @Bind()
  fetchSearchLabels() {
    const { dispatch } = this.props;
    dispatch({ type: 'trRoleManagement/querySearchLabels', payload: { type: 'ROLE' } });
  }

  /**
   * fetchRoleSourceCode - 查询层级值集
   */
  fetchAssignLevelCode() {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/queryCode',
      payload: { lovCode: 'HIAM.RESOURCE_LEVEL' },
    });
  }

  /**
   * fetchHrunitsTree - 查询组织
   * @param {!number} organizationId - 租户ID
   * @param {object} payload - 查询参数
   * @param {!number} payload.userId - 用户ID
   */
  fetchHrunitsTree(organizationId, payload) {
    const { dispatch } = this.props;

    return dispatch({
      type: 'trRoleManagement/queryHrunitsTree',
      organizationId,
      payload,
    });
  }

  /**
   * fetchMemberRolesUsers - 查询角色成员
   * @param {object} payload - 查询参数
   * @param {!number} payload.roleId - 用户ID
   * @param {!number} [payload.size=10] - 分页数目
   * @param {!number} [payload.page=0] - 当前页
   */
  fetchMemberRolesUsers(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/queryMemberRolesUsers',
      payload,
    });
  }

  fetchDetailForm(roleId) {
    const { dispatch } = this.props;
    return dispatch({ type: 'trRoleManagement/queryDetailForm', roleId });
  }

  fetchAdminRole(roleId) {
    const { dispatch } = this.props;
    return dispatch({ type: 'trRoleManagement/queryAdminRole', payload: { roleId } });
  }

  fetchPermissionMenus(roleId, params = {}) {
    const { dispatch } = this.props;
    return dispatch({ type: 'trRoleManagement/queryPermissionMenus', roleId, params });
  }

  fetchCurrentRole() {
    const { dispatch } = this.props;
    return dispatch({ type: 'trRoleManagement/queryCurrentRole' }).then((res) => {
      if (res) {
        this.setState({
          currentRole: res,
          record: res,
        });
      }
    });
  }

  // #endregion

  // #region update data

  saveRoleDetail(roleId, data, cb = (e) => e) {
    const {
      dispatch,
      trRoleManagement: { list },
    } = this.props;
    const { getFieldsValue = (e) => e } = this.queryForm;
    return dispatch({
      type: 'trRoleManagement/saveRole',
      roleId,
      data,
    }).then((res) => {
      if (res) {
        notification.success({
          message: intl.get(`hzero.common.notification.success.save`).d('保存成功'),
        });
        this.fetchList({
          page: list.pagination,
          ...getFieldsValue(),
        });
        cb();
      }
    });
  }

  createRole(data, cb = (e) => e) {
    const { dispatch } = this.props;
    const { getFieldsValue = (e) => e } = this.queryForm;
    return dispatch({ type: 'trRoleManagement/createRole', data }).then((res) => {
      if (res) {
        notification.success({
          message: intl.get(`hzero.common.notification.success.create`).d('创建成功'),
        });
        this.fetchList(getFieldsValue());
        cb();
      }
    });
  }

  copyRole(data, cb = (e) => e) {
    const {
      dispatch,
      trRoleManagement: { list },
    } = this.props;
    const { getFieldsValue = (e) => e } = this.queryForm;
    return dispatch({ type: 'trRoleManagement/copyRole', data }).then((res) => {
      if (res) {
        notification.success({
          message: intl.get(`hzero.common.notification.success.create`).d('创建成功'),
        });
        this.fetchList({ page: list.pagination, ...getFieldsValue() });
        cb();
      }
    });
  }

  inheritRole(data, cb = (e) => e) {
    const {
      dispatch,
      trRoleManagement: { list },
    } = this.props;
    const { getFieldsValue = (e) => e } = this.queryForm;
    return dispatch({ type: 'trRoleManagement/inheritRole', data }).then((res) => {
      if (res) {
        notification.success({
          message: intl.get(`hzero.common.notification.success.create`).d('创建成功'),
        });
        this.fetchList({ page: list.pagination, ...getFieldsValue() });
        cb();
      }
    });
  }

  queryLabel(data) {
    const { dispatch } = this.props;
    return dispatch({ type: 'trRoleManagement/queryRoleLabel', payload: data });
  }

  batchUnassignPermissionSets(roleId, data, cb = (e) => e) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/batchUnassignPermissionSets',
      roleId,
      data,
    }).then((res) => {
      if (res) {
        notification.success();
        cb();
      }
    });
  }

  batchAssignPermissionSets(roleId, data, cb = (e) => e) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/batchAssignPermissionSets',
      roleId,
      data,
    }).then((res) => {
      if (res && res.failed) {
        notification.error({
          description: res.message,
        });
      } else {
        notification.success();
        cb();
      }
    });
  }

  // #endregion

  /**
   * onExpand - 展开树
   * @param {boolean} expanded - 是否展开
   * @param {record} record - 当前行数据
   */
  onExpand(expanded, record) {
    const { expandedRowKeys } = this.state;

    this.setState({
      expandedRowKeys: expanded
        ? expandedRowKeys.concat(record.id)
        : expandedRowKeys.filter((o) => o !== record.id),
    });
  }

  /**
   * openMembersDrawer - 打开分配用户抽屉
   * @param {object} [role={}] - 当前行数据
   */
  openMembersDrawer(role) {
    this.setState({
      currentRowData: role,
      membersDrawerVisible: true,
    });
  }

  /**
   * 打开分配模态框
   * @param {*} role
   */
  openClientsDrawer(role) {
    const {
      dispatch,
      trRoleManagement: { clientPagination = {} },
    } = this.props;
    this.setState({
      currentRowData: role,
    });
    dispatch({
      type: 'trRoleManagement/queryMemberRolesClients',
      payload: {
        roleId: role.id,
        page: clientPagination,
      },
    });
    this.setClientsDrawerVisible(true);
  }

  /**
   * closeMembersDrawer - 关闭分配用户抽屉
   */
  closeMembersDrawer() {
    this.setState(
      {
        membersDrawerVisible: false,
      },
      () => {
        this.setState({
          currentRowData: {},
        });
      }
    );
  }

  /**
   * onCancel方法关闭分配客户端模态框 并清除缓存
   */
  closeClientsDrawer() {
    const { dispatch } = this.props;
    this.setState({
      currentRowData: {},
    });
    this.setClientsDrawerVisible(false);
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: {
        clientList: [],
      },
    });
  }

  // #region no used

  /**
   * redirectCreate - 跳转创建角色页面
   * @param {object} [params={}] - 查询参数
   * @param {number} params.copy_from - 复制并创建角色ID
   * @param {number} params.inherit_from - 继承自角色ID
   * @param {string} params.name - 继承自角色名称
   */
  redirectCreate(params = {}) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/hiam/tr-role/create', search: stringify(params) }));
  }

  /**
   * redirectEdit - 跳转编辑角色页面
   * @param {number} id - 角色ID
   */
  redirectEdit(id) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/hiam/tr-role/edit-detail/${id}` }));
  }

  /**
   * redirectView - 跳转查看角色页面
   * @param {number} id - 角色ID
   */
  redirectView(id) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/hiam/tr-role/detail/${id}` }));
  }

  // #endregion

  /**
   * 分配客户端模态框开关控制
   * @param {*} clientsDrawerVisible
   */
  setClientsDrawerVisible(clientsDrawerVisible = false) {
    const { dispatch } = this.props;
    this.setState({
      clientsDrawerVisible,
    });
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: {
        clientList: [],
      },
    });
  }

  /**
   * setMembersDrawerDataSource - 设置分配用户表格数据
   * @param {Array} [dataSource=[]] - 数据源
   * @param {object} [pagination={}] - 分页
   * @param {!number} [pagination.size=10] - 分页数目
   * @param {!number} [pagination.page=0] - 当前页
   */
  setMembersDrawerDataSource(dataSource = [], pagination = {}) {
    const { membersDrawerPagination } = this.state;
    this.setState({
      membersDrawerDataSource: dataSource,
      membersDrawerPagination: isEmpty(pagination)
        ? createPagination({
            number: membersDrawerPagination.current - 1,
            size:
              dataSource.length > membersDrawerPagination.pageSize
                ? dataSource.length
                : membersDrawerPagination.pageSize,
            totalElements: dataSource.length,
          })
        : pagination,
    });
  }

  /**
   * exportList - 导出
   */
  exportList() {}

  /**
   * expandAll - 全部展开
   */
  expandAll() {
    const { trRoleManagement = {} } = this.props;
    const { list } = trRoleManagement;
    this.setState({
      expandedRowKeys: list.rowKeys || [],
    });
  }

  /**
   * expandAll - 全部收起
   */
  collapseAll() {
    this.setState({
      expandedRowKeys: [],
    });
  }

  closeDetail() {
    this.setState({
      actionType: null,
      currentRowData: {},
      detailDrawerVisible: false,
    });
  }

  openPermissions(record) {
    this.setState({
      permissionDrawerVisible: true,
      currentRowData: record,
    });
  }

  closePermission() {
    this.setState({
      permissionDrawerVisible: false,
      currentRowData: {},
    });
  }

  /**
   * handleAction - 表格按钮事件函数
   * @param {!string} action - 事件类型
   * @param {!object} record - 当前行数据
   */
  handleAction(action, record, isTree) {
    const {
      dispatch = (e) => e,
      trRoleManagement: { list },
    } = this.props;
    const { record: currentRecord } = this.state;
    const { getFieldsValue = (e) => e } = this.queryForm;
    const openDetail = (actionType, options = {}) => {
      if (!isEmpty(actionType)) {
        dispatch({
          type: 'trRoleManagement/queryLabelList',
          payload: { level: record.level === 'site' ? 'SITE' : 'TENANT', type: 'ROLE' },
        });
        dispatch({
          type: 'trRoleManagement/fetchParentRole',
        });
        this.setState({
          actionType,
          currentRowData:
            // eslint-disable-next-line no-nested-ternary
            actionType === 'create' || actionType === 'copy' || actionType === 'inherit'
              ? { ...record, name: isTree ? record.name : currentRecord.name }
              : actionType === 'edit'
              ? record
              : {},
          detailDrawerVisible: true,
          ...options,
        });
      }
    };
    const defaultAction = {
      create: () => {
        // this.redirectEdit(record.id);
        openDetail('create');
      },
      edit: () => {
        // this.redirectEdit(record.id);
        openDetail('edit');
      },
      enabled: () => {
        dispatch({
          type: 'trRoleManagement/setRoleEnabled',
          payload: {
            id: record.id,
            _token: record._token,
            status: !record.enabled,
          },
        }).then((res) => {
          const parseResult = isJSON(res) ? JSON.parse(res) : res;
          if (parseResult.failed) {
            notification.error({ description: parseResult.message });
          } else {
            notification.success();
            this.fetchList({ ...getFieldsValue(), page: list.pagination });
          }
        });
      },
      copy: () => {
        // this.redirectCreate({ copy_from: record.id });
        openDetail('copy', { copyFormId: record.id });
      },
      inherit: () => {
        // this.redirectCreate({ inherit_from: record.id, name: record.name });
        openDetail('inherit', {
          inheritFormId: record.id,
          inheritedRoleName: record.name,
        });
      },
      editPermission: () => {
        this.showModal(record);
      },
      editMembers: () => {
        this.openMembersDrawer(record);
      },
      editClients: () => {
        this.openClientsDrawer(record);
      },
      assignPermissions: () => {
        this.openPermissions(record);
      },
      assignCards: () => {
        this.openRoleAssignCardsEditModal(record);
      },
      editFieldPermission: () => {
        this.gotoFieldPermission(record);
      },
      // editSecurityGroup: () => {
      //   this.openSecurityGroupDrawer(record);
      // },
    };

    if (defaultAction[action]) {
      defaultAction[action]();
    }
  }

  /**
   * handleQueryMembers - 查询角色成员钩子函数
   * @param {object} params - 查询参数
   * @param {!number} params.roleId - 用户ID
   * @param {!number} [params.size=10] - 分页数目
   * @param {!number} [params.page=0] - 当前页
   */
  handleQueryMembers(params = {}) {
    const { currentRowData } = this.state;
    return this.fetchMemberRolesUsers({ roleId: currentRowData.id, ...params });
  }

  /**
   * 查询分配客户端列表
   * @param {*} params
   */
  handleQueryClients(params = {}) {
    const { currentRowData } = this.state;
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/queryMemberRolesClients',
      payload: {
        roleId: currentRowData.id,
        ...params,
      },
    });
  }

  /**
   * 显示分配安全组侧滑
   * @param {object} role - 角色管理列表当前行数据
   */
  // openSecurityGroupDrawer(role) {
  //   const {
  //     dispatch,
  //     trRoleManagement: { secGrpPagination = {} },
  //   } = this.props;
  //   this.setState({
  //     currentRowData: role,
  //   });
  //   dispatch({
  //     type: 'trRoleManagement/querySecurityGroup',
  //     payload: {
  //       roleId: role.id,
  //       page: secGrpPagination,
  //     },
  //   });
  //   this.setSecurityGroupDrawerVisible(true);
  // }

  /**
   * 关闭安全组侧滑
   */
  @Bind()
  closeSecGrpDrawer(callBack) {
    this.setSecurityGroupDrawerVisible(false, callBack);
    this.resetSecGrp();
  }

  /**
   * 分配安全组侧滑开关控制
   * @param {boolean} secGrpDrawerVisible - 是否显示
   * @param {function} cd - 回调函数
   */
  setSecurityGroupDrawerVisible(secGrpDrawerVisible = false, cb = (e) => e) {
    this.setState(
      {
        secGrpDrawerVisible,
      },
      () => {
        cb();
      }
    );
  }

  /**
   * 查询分配安全组列表
   * @param {object} params - 查询参数
   */
  @Bind()
  handleQuerySecGrps(params = {}) {
    const { currentRowData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/querySecurityGroup',
      payload: {
        roleId: currentRowData.id,
        ...params,
      },
    });
  }

  /**
   * 分配安全组查询表单
   * @param {object} fieldsValue - 查询条件
   */
  @Bind()
  handleSecGrpSearch(fieldsValue) {
    this.handleQuerySecGrps(fieldsValue);
  }

  /**
   * 分配安全组分页切换
   * @param {object} pagination - 分页
   * @param {object} fieldsValue - 表单查询条件
   */
  @Bind()
  handleSecGrpPageChange(pagination = {}, fieldsValue) {
    // 分配客户端分页切换
    this.handleQuerySecGrps({
      page: pagination,
      ...fieldsValue,
    });
  }

  /**
   * 查询可分配的安全组
   * @param {object} params - 查询参数
   */
  // @Bind()
  // fetchAssignableSecGrp(params = {}) {
  //   const { currentRowData } = this.state;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'trRoleManagement/fetchAssignableSecGrp',
  //     payload: {
  //       roleId: currentRowData.id,
  //       ...params,
  //     },
  //   });
  // }

  /**
   * 角色分配安全组
   * @param {array} secGrpList - 选中的安全组
   * @param {function} cb - 回调函数
   */
  @Bind()
  handleAssignSecGrp(secGrpList, cb = () => {}) {
    const { currentRowData } = this.state;
    const { dispatch } = this.props;
    const list = secGrpList.map((item) => item.secGrpId);
    return dispatch({
      type: 'trRoleManagement/assignSecGrp',
      roleId: currentRowData.id,
      secGrpList: list,
    }).then((res) => {
      if (res) {
        notification.success();
        cb();
        this.handleQuerySecGrps();
      }
    });
  }

  /**
   * 角色取消分配安全组
   * @param {array} selectedRows - 选中的安全组集合
   */
  @Bind()
  handleDeleteSecGrp(selectedRows) {
    const { currentRowData } = this.state;
    const { dispatch } = this.props;
    const list = selectedRows.map((item) => item.secGrpId);
    return dispatch({
      type: 'trRoleManagement/deleteSecGrp',
      payload: { roleId: currentRowData.id, secGrpList: list },
    });
  }

  /**
   * 查询角色已分配的指定安全组的访问权限
   * @param {number} secGrpId - 安全组ID
   */
  @Bind()
  fetchVisitPermission(secGrpId) {
    const { dispatch } = this.props;
    const { currentRowData } = this.state;
    return dispatch({
      type: 'trRoleManagement/querySecGrpPermissionMenus',
      roleId: currentRowData.id,
      secGrpId,
    });
  }

  /**
   * 查询角色已分配的指定安全组的字段权限
   * @param {number} secGrpId - 安全组ID
   */
  @Bind()
  fetchFieldPermission(secGrpId) {
    const { dispatch } = this.props;
    const { currentRowData } = this.state;
    dispatch({
      type: 'trRoleManagement/queryFieldPermission',
      payload: { secGrpId, roleId: currentRowData.id },
    });
  }

  /**
   * 查询角色已分配的指定安全组的字段配置列表
   * @param {object} params - 请求参数
   */
  @Bind()
  fetchFieldConfigList(params = {}) {
    const { dispatch } = this.props;
    const { currentRowData } = this.state;
    return dispatch({
      type: 'trRoleManagement/queryFieldConfig',
      payload: { roleId: currentRowData.id, ...params },
    });
  }

  /**
   * 查询角色已分配的指定安全组的工作台权限
   * @param {number} secGrpId - 安全组ID
   */
  @Bind()
  fetchCardPermission(secGrpId) {
    const { dispatch } = this.props;
    const { currentRowData } = this.state;
    dispatch({
      type: 'trRoleManagement/queryCardPermission',
      payload: { secGrpId, roleId: currentRowData.id },
    });
  }

  /**
   * 查询角色已分配的指定安全组的数据权限维度
   * @param {number} secGrpId - 安全组ID
   */
  @Bind()
  fetchDataDimension(secGrpId) {
    const { dispatch } = this.props;
    const { currentRowData } = this.state;
    dispatch({
      type: 'trRoleManagement/queryDataDimension',
      payload: { secGrpId, roleId: currentRowData.id },
    });
  }

  /**
   * 查询角色已分配的指定安全组的数据权限的tab页
   * @param {number} secGrpId - 安全组ID
   */
  @Bind()
  fetchDataPermission(secGrpId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/queryDataPermissionTab',
      secGrpId,
    });
  }

  /**
   * 屏蔽/取消屏蔽安全组权限
   * @param {object} payload - 请求数据
   */
  @Bind()
  handleShieldPermission(payload, callBack = (e) => e) {
    const { dispatch } = this.props;
    const { shieldFlag, ...rest } = payload;
    const type = `trRoleManagement/${
      shieldFlag ? 'cancelShieldSecGrpPermission' : 'shieldSecGrpPermission'
    }`;
    dispatch({
      type,
      payload: rest,
    }).then((res) => {
      if (res) {
        callBack();
      }
    });
  }

  /**
   * 清空安全组侧滑的数据
   */
  @Bind()
  resetSecGrp() {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: {
        secGrpList: [], // 安全组列表
        secGrpPagination: {}, // 安全组分页
        secGrpAddModalList: [], // 可分配安全组列表
        secGrpAddModalPagination: {}, // 可分配安全组分页
        secGrpFieldPermissionList: [], // 安全组字段权限列表
        secGrpFieldPermissionPagination: {}, // 安全组字段权限分页
        secGrpCardList: [], // 安全组工作台权限列表
        secGrpCardPagination: {}, // 安全组工作台权限分页
        secGrpDimensionList: [], // 安全组数据权限维度列表
        secGrpDimensionPagination: {}, // 安全组数据权限维度分页
        secGrpDataPermissionTabList: [], // 安全组数据权限tab页
      },
    });
  }

  /**
   * 清空安全组权限数据
   */
  @Bind()
  resetPermissions() {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: {
        secGrpFieldPermissionList: [], // 安全组字段权限列表
        secGrpFieldPermissionPagination: {}, // 安全组字段权限分页
        secGrpCardList: [], // 安全组工作台权限列表
        secGrpCardPagination: {}, // 安全组工作台权限分页
        secGrpDimensionList: [], // 安全组数据权限维度列表
        secGrpDimensionPagination: {}, // 安全组数据权限维度分页
        secGrpDataPermissionTabList: [], // 安全组数据权限tab页
      },
    });
  }

  /**
   * handleSaveMembers - 保存角色成员钩子函数
   * @param {object} data - 表单数据
   * @param {!number} isEdit - 后台关键参数
   * @param {!function} cb - 异步事件函数
   */
  handleSaveMembers(data, isEdit = false, cb) {
    const {
      dispatch,
      trRoleManagement: { list },
    } = this.props;
    const { getFieldsValue = (e) => e } = this.queryForm;
    dispatch({
      type: 'trRoleManagement/saveMembers',
      data,
      isEdit,
    }).then((res) => {
      if (res) {
        this.fetchList({ page: list.pagination, ...getFieldsValue() } || {});
        if (isFunction(cb)) {
          cb();
        }
      }
    });
  }

  /**
   * handleDeleteMembers - 删除角色成员钩子函数
   * @param {object} data - 表单数据
   * @param {!function} cb - 异步事件函数
   */
  handleDeleteMembers(data, cb = (e) => e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/deleteMembers',
      data,
    }).then((res) => {
      if (res && res.failed) {
        notification.error({ description: res.message });
      } else {
        cb();
      }
    });
  }

  /**
   * handleDeleteMembers - 删除角色成员钩子函数
   * @param {object} data - 删除的用户
   */
  @Bind()
  async handleDeleteMember(data) {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'trRoleManagement/deleteMembers',
      data,
    });
    return res;
  }

  @Bind()
  showModal(record) {
    const { dispatch } = this.props;
    const { id: roleId, tenantId } = record;
    this.setState(
      {
        selectedRoleId: roleId,
        tenantId,
      },
      () => {
        this.handleModalVisible(true);
        dispatch({
          type: 'trRoleManagement/queryRoleAuthType',
        });
        dispatch({
          type: 'trRoleManagement/queryRoleAuth',
          payload: {
            roleId,
            body: {
              page: 0,
              size: 10,
            },
          },
        });
      }
    );
  }

  @Bind()
  hideModal(func) {
    const { saving = false } = this.props;
    if (!saving) {
      this.handleModalVisible(false);
      if (func) {
        func();
      }
    }
  }

  handleModalVisible(flag) {
    this.setState({
      modalVisible: !!flag,
    });
  }

  @Bind()
  queryAuthDocType(
    params = {
      page: 0,
      size: 10,
    }
  ) {
    const { dispatch } = this.props;
    const { selectedRoleId: roleId } = this.state;
    dispatch({
      type: 'trRoleManagement/queryRoleAuth',
      payload: {
        roleId,
        body: params,
      },
    });
  }

  @Bind()
  saveAuthDocType(data, func) {
    const { dispatch } = this.props;
    const { selectedRoleId: roleId } = this.state;
    if (!isEmpty(data)) {
      dispatch({
        type: 'trRoleManagement/saveRoleAuth',
        payload: {
          roleId,
          body: data,
        },
      }).then((res) => {
        if (isArray(res)) {
          notification.success();
          this.hideModal(func);
        } else {
          notification.error();
        }
      });
    } else {
      this.hideModal();
    }
  }

  @Bind()
  deleteAuthDocType(data) {
    const { dispatch } = this.props;
    const { selectedRoleId: roleId } = this.state;
    dispatch({
      type: 'trRoleManagement/deleteRoleAuth',
      payload: {
        roleId,
        body: data,
      },
    }).then(() => {
      this.queryAuthDocType();
    });
  }

  @Bind()
  onListChange(page) {
    const { getFieldsValue = (e) => e } = this.queryForm;
    this.fetchList({ page, ...getFieldsValue() });
  }

  // 角色分配卡片
  @Bind()
  fetchRoleCards(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/fetchRoleCards',
      payload,
    });
  }

  @Bind()
  removeRoleCards(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/removeRoleCards',
      payload,
    });
  }

  /**
   * 打开角色分配租户模态框
   */
  openRoleAssignCardsEditModal(editRecord) {
    this.setState({
      roleAssignCardsEditModalProps: {
        role: editRecord,
        visible: true,
      },
    });
  }

  /**
   * 进入角色字段权限维护 界面
   */
  gotoFieldPermission(editRecord) {
    const { dispatch } = this.props;
    deleteCache('/hiam/role/api/list');
    deleteCache('/hiam/role/api/search-form');
    dispatch(
      routerRedux.push({
        pathname: `/hiam/tr-role/api/${editRecord.id}`,
      })
    );
  }

  hiddenRoleAssignCardsEditModal() {
    this.setState({
      roleAssignCardsEditModalProps: {
        role: {},
        visible: false,
      },
    });
  }

  // 角色分配卡片 模态框 确认
  @Bind()
  handleRoleAssignOk(payload) {
    this.handleCardOk(payload).then(() => {
      // 成功 关闭模态框
      this.hiddenRoleAssignCardsEditModal();
    });
  }

  @Bind()
  handleCardOk(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'trRoleManagement/saveRoleCards',
      payload,
    }).then((res) => {
      if (res) {
        notification.success();
      }
    });
  }

  // 角色分配卡片 模态框 取消
  @Bind()
  handleRoleAssignCancel() {
    this.hiddenRoleAssignCardsEditModal();
  }

  /**
   * 批量删除客户端
   * @param {*} selectedRows
   */
  @Bind()
  handleDeleteClient(data, cb = (e) => e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/deleteMembers',
      data,
    }).then((res) => {
      this.handleQueryClients();
      if (res && res.failed) {
        notification.error({ description: res.message });
      } else {
        cb();
        notification.success();
      }
    });
  }

  /**
   * 新建客户端行
   */
  @Bind()
  handleAddClient() {
    const {
      dispatch,
      trRoleManagement: { clientList = [], clientPagination = {} },
    } = this.props;
    const { currentRowData } = this.state;
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: {
        clientList: [
          {
            _status: 'create',
            id: `create-${uuidv4()}`,
            tenantName: '',
            assignLevel: currentRowData.assignLevel,
            assignLevelMeaning: currentRowData.assignLevelMeaning,
            assignLevelValueMeaning: currentRowData.assignLevelValueMeaning,
          },
          ...clientList,
        ],
        clientPagination: addItemToPagination(clientList.length, clientPagination),
      },
    });
  }

  /**
   * 删除新建行
   * @param {*} record
   */
  @Bind()
  handleDeleteRow(record) {
    const {
      dispatch,
      trRoleManagement: { clientList = [], clientPagination = {} },
    } = this.props;
    const newList = clientList.filter((item) => item.id !== record.id);
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: {
        clientList: newList,
        clientPagination: delItemToPagination(clientList.length, clientPagination),
      },
    });
  }

  /**
   * 编辑行数据
   * @param {*} record
   * @param {*} flag
   */
  @Bind
  handleEditRow(record, flag) {
    const {
      dispatch,
      trRoleManagement: { clientList = [] },
    } = this.props;
    const newList = clientList.map((item) => {
      if (record.id === item.id) {
        return { ...item, _status: flag ? 'update' : '' };
      }
      return item;
    });
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: { clientList: newList },
    });
  }

  /**
   * 取消编辑行数据
   * @param {*} record
   * @param {*} flag
   */
  @Bind
  handleCancelEdit(record, flag) {
    const {
      dispatch,
      trRoleManagement: { clientList = [] },
    } = this.props;
    const newList = clientList.map((item) => {
      if (record.id === item.id) {
        return { ...item, _status: flag ? 'update' : '' };
      }
      return item;
    });
    dispatch({
      type: 'trRoleManagement/updateState',
      payload: { clientList: newList },
    });
  }

  /**
   * 保存客户端
   * @param {*} params
   */
  @Bind
  handleSaveClient(data, isEdit = false, cb) {
    const { dispatch } = this.props;
    dispatch({
      type: 'trRoleManagement/saveMembers',
      data,
      isEdit,
    }).then((res) => {
      if (res) {
        notification.success();
        this.handleQueryClients();
        this.setClientsDrawerVisible(false);
        if (isFunction(cb)) {
          cb();
        }
      }
    });
  }

  /**
   * 分配客户端分页切换
   * @param {*} pagination
   */
  @Bind()
  handleClientPageChange(pagination = {}, fieldsValue) {
    // 分配客户端分页切换
    this.handleQueryClients({
      page: pagination,
      ...fieldsValue,
    });
  }

  /**
   * 分配客户端查询表单
   * @param {*} fieldsValue
   */
  @Bind()
  handleClientSearch(fieldsValue) {
    this.handleQueryClients(fieldsValue);
  }

  @Bind()
  handleAddCard(params = {}) {
    const {
      dispatch,
      trRoleManagement: { cardListPagination = {} },
    } = this.props;
    dispatch({
      type: 'trRoleManagement/queryRoleCard',
      payload: { page: cardListPagination, ...params },
    });
  }

  @Bind()
  handleCardAddTableChange(pagination = {}, fieldsValue) {
    this.handleAddCard({
      page: pagination,
      ...fieldsValue,
    });
  }

  @Bind()
  handleChangeLov(_, record = {}) {
    const { getFieldsValue = (e) => e } = this.queryForm;
    this.setState({ record }, () => {
      this.fetchList({
        ...getFieldsValue(),
      });
    });
  }

  /**
   * render
   * @return React.element
   */
  render() {
    const { tenantsLoaded = false } = this.state;
    const isTenant = isTenantRoleLevel();
    if (isTenant && !tenantsLoaded) {
      return (
        <div className={styles['hiam-role-list']}>
          <Header title={intl.get(`hiam.trRoleManagement.view.title.listHeader`).d('角色管理')} />
          <Content>
            <Spin spinning />
          </Content>
        </div>
      );
    }
    const {
      // form,
      match: { path },
      trRoleManagement = {},
      tenantRoleLevel,
      saveAuthLoading = false,
      roleAuthLoading = false,
      queryListLoading = false,
      saveMembersLoading = false,
      queryMemberRolesClientsLoading = false,
      deleteMembersLoading = false,
      queryMemberRolesUsersLoading = false,
      queryDetailFormLoading = false,
      queryAdminRoleLoading = false,
      saveRoleLoading = false,
      createRoleLoading = false,
      copyRoleLoading = false,
      inheritRoleLoading = false,
      queryPermissionMenusLoading = false,
      batchAssignPermissionSetsLoading = false,
      batchUnassignPermissionSetsLoading = false,
      fetchRoleCardsLoading = false,
      removeRoleCardsLoading = false,
      saveRoleCardsLoading = false,
      fetchTabListLoading,
      updateCompanyLoading,
      fetchCompanyLoading,
      refreshCompanyLoading,
      addPurOrgLoading,
      fetchPurOrgLoading,
      fetchModalPurOrgLoading,
      addPuragentLoading,
      fetchPuragentLoading,
      fetchModalPuragentLoading,
      addValueListLoading,
      fetchValueListLoading,
      fetchModalValueListLoading,
      queryRoleCardLoading,
      addLovViewLoading,
      fetchLovViewLoading,
      fetchModalLovViewLoading,
      addDataSourceLoading,
      fetchDataSourceLoading,
      fetchModalDataSourceLoading,
      addDataGroupLoading,
      fetchDataGroupLoading,
      fetchModalDataGroupLoading,
      // querySecGrpLoading,
      // queryAssignableSecGrpLoading,
      // assignSecGrpLoading,
      // deleteSecGrpLoading,
      // queryVisitPermissionLoading,
      // queryFieldPermissionLoading,
      // queryFieldConfigLoading,
      // queryCardLoading,
      // queryDataDimensionLoading,
      // shieldLoading,
      // queryDataPermissionTabLoading,
      trRoleDataAuthorityCompany = {},
      trRoleDataAuthorityPurorg = {},
      trRoleDataAuthorityManagement = {},
      trRoleDataAuthorityPuragent = {},
      trRoleDataAuthorityLovView = {},
      trRoleDataAuthorityDataSource = {},
      trRoleDataAuthorityValueList = {},
      trRoleDataAuthorityDataGroup = {},
      trRoleManagement: {
        clientList = [],
        userTypeList = [],
        cardList = [],
        labelList = [],
        cardListPagination = {},
        parentRole = {},
        // secGrpList = [],
        // secGrpPagination = {},
        // secGrpAddModalList = [],
        // secGrpAddModalPagination = {},
        // secGrpFieldPermissionList = [],
        // secGrpFieldPermissionPagination = {},
        // secGrpCardList = [],
        // secGrpCardPagination = {},
        // secGrpDimensionList = [],
        // secGrpDimensionPagination = {},
        // secGrpDataPermissionTabList = [],
      },
    } = this.props;
    const {
      membersDrawerVisible,
      clientsDrawerVisible,
      // secGrpDrawerVisible,
      membersDrawerDataSource,
      membersDrawerPagination,
      currentRowData,
      selectedRoleId,
      detailDrawerVisible,
      actionType,
      inheritedRoleName,
      copyFormId,
      inheritFormId,
      permissionDrawerVisible,
      currentRole,
      expandedRowKeys,
      roleAssignCardsEditModalProps,
      tenantsMulti,
      tenantId,
      record,
    } = this.state;
    const {
      code,
      searchLabels = [],
      list = {},
      roleAuth = {},
      roleAuthScopeCode = [],
      roleAuthScopeTypeCode = [],
      clientPagination = {},
    } = trRoleManagement;
    const organizationId = getCurrentOrganizationId();

    const searchProps = {
      ref: (node) => {
        this.queryForm = node;
      },
      handleQueryList: this.fetchList,
      code: code['HIAM.ROLE_SOURCE'] || [],
      roleLevel: code['HIAM.RESOURCE_LEVEL'] || [],
      loading: queryListLoading,
      tenantRoleLevel,
      searchLabels,
    };

    const listProps = {
      dataSource: list.dataSource || [],
      pagination: list.pagination || {},
      loading: queryListLoading,
      code: code['HIAM.ROLE_SOURCE'],
      handleAction: this.handleAction.bind(this),
      onExpand: this.onExpand.bind(this),
      expandedRowKeys,
      currentRole,
      organizationId,
      tenantRoleLevel,
      onListChange: this.onListChange,
      tenantsMulti,
      path,
      record,
    };
    const membersDrawerProps = {
      path,
      tenantRoleLevel,
      visible: membersDrawerVisible,
      title: intl.get(`hiam.roleManagement.view.title.members`).d('分配用户'),
      contentTitle: intl
        .get('hiam.roleManagement.view.title.content.members', {
          name: currentRowData.name,
        })
        .d(`给"${currentRowData.name}"分配用户`),
      roleDatasource: currentRowData,
      userTypeList,
      resourceLevel: code['HIAM.RESOURCE_LEVEL'],
      processing: {
        save: saveMembersLoading,
        delete: deleteMembersLoading,
        query: queryMemberRolesUsersLoading,
      },
      handleSave: this.handleSaveMembers.bind(this),
      close: this.closeMembersDrawer.bind(this),
      handleFetchData: this.handleQueryMembers.bind(this),
      handleFetchHrunitsTree: this.fetchHrunitsTree.bind(this),
      handleSetDataSource: this.setMembersDrawerDataSource.bind(this),
      handleDelete: this.handleDeleteMembers.bind(this),
      onDeleteMember: this.handleDeleteMember,
      dataSource: membersDrawerDataSource,
      pagination: membersDrawerPagination,
    };

    const clientsDrawerProps = {
      path,
      tenantRoleLevel,
      visible: clientsDrawerVisible,
      title: intl.get(`hiam.roleManagement.view.title.clients`).d('分配客户端'),
      close: this.closeClientsDrawer.bind(this),
      handleFetchData: this.handleQueryClients.bind(this),
      roleDatasource: currentRowData,
      clientList,
      clientPagination,
      saveLoading: saveMembersLoading,
      deleteLoading: deleteMembersLoading,
      queryLoading: queryMemberRolesClientsLoading,
      onEdit: this.handleEditRow,
      onCancelEdit: this.handleCancelEdit,
      onDeleteClient: this.handleDeleteClient,
      onAddClient: this.handleAddClient,
      onDeleteRow: this.handleDeleteRow,
      onSave: this.handleSaveClient,
      onClientPageChange: this.handleClientPageChange,
      onFormSearch: this.handleClientSearch,
    };

    // const secGrpDrawerProps = {
    //   path,
    //   roleId: currentRowData.id,
    //   tenantId,
    //   visible: secGrpDrawerVisible,
    //   secGrpList,
    //   secGrpPagination,
    //   secGrpAddModalList,
    //   secGrpAddModalPagination,
    //   secGrpFieldPermissionList,
    //   secGrpFieldPermissionPagination,
    //   secGrpCardList,
    //   secGrpCardPagination,
    //   secGrpDimensionList,
    //   secGrpDimensionPagination,
    //   secGrpDataPermissionTabList,
    //   onCancel: this.closeSecGrpDrawer,
    //   onFormSearch: this.handleSecGrpSearch,
    //   onAssignSecGrp: this.handleAssignSecGrp,
    //   onDelete: this.handleDeleteSecGrp,
    //   onSecGrpPageChange: this.handleSecGrpPageChange,
    //   onFetchVisitPermission: this.fetchVisitPermission,
    //   onFetchFieldPermission: this.fetchFieldPermission,
    //   onFetchFieldConfigList: this.fetchFieldConfigList,
    //   onFetchCardPermission: this.fetchCardPermission,
    //   onFetchDataDimension: this.fetchDataDimension,
    //   onFetchDataPermission: this.fetchDataPermission,
    //   onShield: this.handleShieldPermission,
    //   fetchAssignableSecGrp: this.fetchAssignableSecGrp,
    //   queryLoading: querySecGrpLoading,
    //   deleteLoading: deleteSecGrpLoading,
    //   queryModalLoading: queryAssignableSecGrpLoading,
    //   saveModalLoading: assignSecGrpLoading,
    //   queryVisitPermissionLoading,
    //   queryFieldPermissionLoading,
    //   queryFieldConfigLoading,
    //   queryCardLoading,
    //   queryDataDimensionLoading,
    //   shieldLoading,
    //   queryDataPermissionTabLoading,
    //   onResetPermissions: this.resetPermissions,
    // };

    const detailDrawerProps = {
      path,
      visible: detailDrawerVisible,
      actionType,
      organizationId: currentRole.tenantId,
      organizationName: currentRole.tenantName,
      roleId: currentRowData.id,
      labelList,
      processing: {
        query: queryDetailFormLoading,
        queryAdminRole: queryAdminRoleLoading,
        save: saveRoleLoading,
        create: createRoleLoading,
        copy: copyRoleLoading,
        inherit: inheritRoleLoading,
      },
      close: this.closeDetail.bind(this),
      fetchDataSource: this.fetchDetailForm.bind(this),
      fetchAdminRole: this.fetchAdminRole.bind(this),
      save: this.saveRoleDetail.bind(this),
      create: this.createRole.bind(this),
      copy: this.copyRole.bind(this),
      inherit: this.inheritRole.bind(this),
      queryLabel: this.queryLabel.bind(this),
      inheritedRoleName,
      roleSourceCode: code['HIAM.ROLE_SOURCE'] || [],
      copyFormId,
      inheritFormId,
      currentRowData,
      tenantRoleLevel,
      parentRole,
    };

    const permissionDrawerProps = {
      tenantRoleLevel,
      visible: permissionDrawerVisible,
      close: this.closePermission.bind(this),
      roleName: currentRowData.name,
      roleId: currentRowData.id,
      processing: {
        query: queryPermissionMenusLoading,
        batchAssignPermissionSets: batchAssignPermissionSetsLoading,
        batchUnassignPermissionSets: batchUnassignPermissionSetsLoading,
      },
      fetchDataSource: this.fetchPermissionMenus.bind(this),
      batchAssignPermissionSets: this.batchAssignPermissionSets.bind(this),
      batchUnassignPermissionSets: this.batchUnassignPermissionSets.bind(this),
    };

    // 工作台配置的属性
    const roleAssignProps = {
      path,
      ...roleAssignCardsEditModalProps,
      tenantRoleLevel,
      onFetchRoleCards: this.fetchRoleCards,
      onRemoveRoleCards: this.removeRoleCards,
      queryRoleCardLoading,
      onOk: this.handleRoleAssignOk,
      onAdd: this.handleCardOk,
      onCancel: this.handleRoleAssignCancel,
      onAddCard: this.handleAddCard,
      loading: {
        fetchRoleCards: fetchRoleCardsLoading,
        removeRoleCards: removeRoleCardsLoading,
        saveRoleCards: saveRoleCardsLoading,
      },
      cardListPagination,
      cardList,
      cardTableChange: this.handleCardAddTableChange,
      onFormSearch: this.handleAddCard,
    };

    const authDataProps = {
      trRoleDataAuthorityCompany,
      trRoleDataAuthorityPurorg,
      trRoleDataAuthorityManagement,
      trRoleDataAuthorityPuragent,
      trRoleDataAuthorityLovView,
      trRoleDataAuthorityDataSource,
      trRoleDataAuthorityValueList,
      trRoleDataAuthorityDataGroup,
      fetchTabListLoading,
      // 公司 loading
      updateCompanyLoading,
      fetchCompanyLoading,
      refreshCompanyLoading,
      // 采购组织
      addPurOrgLoading,
      fetchPurOrgLoading,
      fetchModalPurOrgLoading,
      // 采购员
      addPuragentLoading,
      fetchPuragentLoading,
      fetchModalPuragentLoading,
      // 值集
      addValueListLoading,
      fetchValueListLoading,
      fetchModalValueListLoading,
      // 值集视图
      addLovViewLoading,
      fetchLovViewLoading,
      fetchModalLovViewLoading,
      // 数据源
      addDataSourceLoading,
      fetchDataSourceLoading,
      fetchModalDataSourceLoading,
      // 数据组
      addDataGroupLoading,
      fetchDataGroupLoading,
      fetchModalDataGroupLoading,
    };

    return (
      <div className={styles['hiam-role-list']}>
        <Header title={intl.get(`hiam.roleManagement.view.title.listHeader`).d('角色管理')}>
          <ButtonPermission
            permissionList={[
              {
                code: `${path}.button.roleCreate`,
                type: 'button',
                meaning: '角色管理-创建角色',
              },
            ]}
            onClick={() => this.handleAction('create', this.state.record)}
            icon="plus"
            type="primary"
          >
            {intl.get('hiam.roleManagement.view.button.roleCreate').d('创建角色')}
          </ButtonPermission>
        </Header>
        <Content>
          <Search {...searchProps} />
          <List {...listProps} />
        </Content>
        <AssignMember {...membersDrawerProps} />
        <ClientsDrawer {...clientsDrawerProps} />
        {/* <AssignSecGrpDrawer {...secGrpDrawerProps} /> */}
        <AuthDrawer
          title={intl.get(`hiam.roleManagement.view.title.editPermission`).d('维护数据权限')}
          path={path}
          roleId={selectedRoleId}
          roleAuth={roleAuth}
          roleAuthScopeCode={roleAuthScopeCode}
          roleAuthScopeTypeCode={roleAuthScopeTypeCode}
          handleDelete={this.deleteAuthDocType}
          handleQuery={this.queryAuthDocType}
          saveLoading={saveAuthLoading}
          initLoading={roleAuthLoading}
          modalVisible={this.state.modalVisible}
          onOk={this.saveAuthDocType}
          onCancel={this.hideModal}
          tenantId={tenantId}
          width={1200}
          {...authDataProps}
        />
        {detailDrawerVisible && <DetailDrawer {...detailDrawerProps} />}
        <PermissionDrawer {...permissionDrawerProps} />
        <RoleAssignCardsEditModal {...roleAssignProps} />
      </div>
    );
  }
}
